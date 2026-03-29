// import { handleSessionCompleted } from "../services/achievement.service.js";
import { EventIndexModel } from "../models/eventIndex.model.js";
import { kafka } from "./kafka.client.js";
import { AchievementUnlockedEventSchema, TOPICS, UserDeletedEventSchema } from "@langphy/shared";
import { producer } from "./producer.js";
import { AchievementsRepo } from "../repos/achievement.repo.js";
import { DeletedUsersRepo } from "../repos/deleted-users.repo.js";
import { UserAchievementsRepo } from "../repos/user-achievement.repo.js";
import { handleAchievementsUnlocked } from "../services/achievement.service.js";

const consumer = kafka.consumer({
    groupId: `${process.env.SERVICE_NAME}-group`
});

export const initConsumer = async () => {
    await consumer.connect();
    
    await consumer.subscribe({
        topic: TOPICS.SESSION_COMPLETED,
        fromBeginning: false
    });
    
    await consumer.subscribe({
        topic: TOPICS.USER_DELETED,
        fromBeginning: false
    });

    await consumer.run({
        eachMessage: async ({ topic, message }) => {
            if( !message.value ) return;

            const rawData = JSON.parse( message.value.toString() );

            if( topic === TOPICS.ACHIEVEMENTS_UPDATED ) {    
                const event = AchievementUnlockedEventSchema.parse(rawData);
                
                const existing = await EventIndexModel.exists( event.event_id );
                if(existing) return;
                if(await DeletedUsersRepo.exists( event.user_id )) return;

                const result = await handleAchievementsUnlocked( event );

                if(result.updated) {
                    await producer?.send({
                        topic: TOPICS.ACHIEVEMENT_UNLOCKED,
                        messages: [{
                            key: event.user_id,
                            value: JSON.stringify({
                                event_type: "achievement.unlocked",
                                payload: event.payload
                            }),
                        }],
                    });
                }

                await EventIndexModel.markProcessed(event);
            }

            if ( topic === TOPICS.USER_DELETED ) {
                const event = UserDeletedEventSchema.parse( rawData );
                try {
                    if ( await EventIndexModel.exists( event.event_id ) ) return;

                    await DeletedUsersRepo.insert( event.user_id );

                    await AchievementsRepo.deleteAchievementsByUserId( event.user_id );
                    await UserAchievementsRepo.deleteUserAchievementsByUserId( event.user_id );

                    await EventIndexModel.markProcessed( event );

                    console.log( "🗑 Achievements or User Achievements are deleted for:", event.user_id );
                }
                catch(err) {
                    console.error( "Achievements or User Achievements deletion failed:", err );
                }
            }

        }
    });
};

export const stopConsumer = async () => {
  await consumer.disconnect();
};