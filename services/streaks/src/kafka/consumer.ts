import { v4 as uuid } from "uuid";
import { PracticeCompletedEventSchema, UserRegisteredEventSchema } from "@langphy/shared/events";
import { kafka } from "./kafka.client.js";
import { TOPICS } from "@langphy/shared/events/topics.js";
import { StreakModel } from "src/models/streaks.model.js";
import { publishStreakEvent, publishStreakUpdated } from "./producer.js";

const consumer = kafka.consumer({
    groupId: process.env.SERVICE_NAME + '-group'
});

export const initConsumer = async () => {
    await consumer.connect();

    await consumer.subscribe({ topic: TOPICS.USER_REGISTERED });
    await consumer.subscribe({ topic: TOPICS.PRACTICE_COMPLETED });

    await consumer.run({
        eachMessage: async ( { topic, message } ) => {
            const data = JSON.parse( message.value!.toString() );

            switch( topic ) {
                case TOPICS.USER_REGISTERED : {
                    const event = UserRegisteredEventSchema.parse( data );
                    await StreakModel.initIfNotExists( event.user_id );
                    break;
                }

                case TOPICS.PRACTICE_COMPLETED : {
                    const event = PracticeCompletedEventSchema.parse( data );
                    const streak = await StreakModel.updateStreak( event.user_id );

                    const is_active = streak.current_streak > 0;
                    await publishStreakUpdated({
                        event_id: uuid(),
                        event_type: "streak.updated",
                        event_version: 1,
                        occurred_at: new Date().toISOString(),
                        user_id: event.user_id,
                        payload: {
                            current_streak: streak.current_streak,
                            longest_streak: streak.longest_streak,
                            last_activity_date: streak.last_activity_date,
                            is_active
                        },
                    });

                    // await publishStreakEvent(
                    //     TOPICS.STREAK_UPDATED,
                    //     {
                    //         event_id: uuid(),
                    //         event_type: "streak.updated",
                    //         event_version: 1,
                    //         occurred_at: new Date().toISOString(),
                    //         user_id: event.user_id,
                    //         payload: streak
                    //     }
                    // );
                }
            }

        },
    });
};