import { v4 as uuid } from "uuid";
import { kafka } from "./kafka.client.js";
import { StreakModel } from "../models/streaks.model.js";
import { publishStreakUpdated } from "./producer.js";
import { PracticeCompletedEventSchema, TOPICS, UserRegisteredEventSchema } from "@langphy/shared";

export const consumer = kafka.consumer({
    groupId: process.env.SERVICE_NAME + '-group'
});

export const initConsumer = async () => {
    await consumer.connect();

    await consumer.subscribe({ topic: TOPICS.USER_REGISTERED });
    await consumer.subscribe({ topic: TOPICS.PRACTICE_COMPLETED });

    await consumer.run({
        eachMessage: async ( { topic, message } ) => {
            const data = JSON.parse( message.value!.toString() );

            // console.log("Topic:", topic);

            switch( topic ) {
                case TOPICS.USER_REGISTERED : {
                    try {
                        const event = UserRegisteredEventSchema.parse(data);

                        console.log("💡 Attempting to create streak for", event.user_id);

                        const streak = await StreakModel.createStreak(event.user_id);

                        if (!streak) console.warn("⚠️ Streak returned null!");
                        else console.log("✅ Streak created for user:", streak.user_id);
                    } catch (err) {
                        console.error("❌ USER_REGISTERED handler failed:", err);
                    }
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