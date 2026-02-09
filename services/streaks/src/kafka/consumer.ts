import { v4 as uuid } from "uuid";
import { kafka } from "./kafka.client.js";
import { producer } from "./producer.js";
import { TOPICS } from "@langphy/shared";
import { EventIndexModel } from "../models/eventIndex.model.js";
import { StreakRepo } from "src/repos/streaks.repo.js";

export const consumer = kafka.consumer({
    groupId: process.env.SERVICE_NAME + '-group'
});

export const initConsumer = async () => {
    await consumer.connect();

    // await consumer.subscribe({ topic: TOPICS.USER_REGISTERED });
    // await consumer.subscribe({topic: TOPICS.STREAK_UPDATED})
    await consumer.subscribe({
        topic: TOPICS.SESSION_COMPLETED,
        fromBeginning: false
    });

    await consumer.run({
        eachMessage: async ( { topic, message } ) => {
            if( !message.value ) return;

            const event = JSON.parse( message.value!.toString() );

            // 1️⃣ Idempotency
            if( await EventIndexModel.exists( event.event_id ) ) return;

            // 2️⃣ Apply streak logic
            const result = await StreakRepo.applyActivity({ userId: event.user_id });

            // 3️⃣ Emit only if something changed
            if( result.updated ) {
                await producer.send({
                    topic: TOPICS.STREAK_UPDATED,
                    messages: [
                        {
                            key: event.user_id,
                            value: JSON.stringify({
                                event_type: "streak.updated.v1",
                                event_id: uuid(), // crypto.randomUUID(),
                                event_version: 1,
                                user_id: event.user_id,
                                // current_streak: result.currentStreak,
                                // longest_streak: result.longestStreak,
                                // last_activity_date: result.lastActivityDate,
                                // celebration: result.celebration ?? null,
                                occurred_at: event.occurredAt,
                                payload: {
                                    current_streak: result.currentStreak,
                                    longest_streak: result.longestStreak,
                                    last_activity_date: result.lastActivityDate,
                                    celebration: result.celebration,
                                },
                            }),
                        },
                    ],
                });
            }

            // 4️⃣ Mark inbox
            await EventIndexModel.markProcessed({
                event_id: event.event_id,
                event_type: event.event_type,
                event_version: event.event_version,
                user_id: event.user_id,
                occurred_at: event?.occurred_at ?? new Date().toISOString(),
                payload: event
            });
            
        },
    });
};



// switch( topic ) {
//     case TOPICS.USER_REGISTERED : {
//         try {
//             const event = UserRegisteredEventSchema.parse(eventData);

//             console.log("💡 Attempting to create streak for", event.user_id);

//             const streak = await StreakModel.createStreak(event.user_id);

//             if (!streak) console.warn("⚠️ Streak returned null!");
//             else console.log("✅ Streak created for user:", streak.user_id);
//         } catch (err) {
//             console.error("❌ USER_REGISTERED handler failed:", err);
//         }
//         break;
//     }

//     case TOPICS.SESSION_COMPLETED : {
//         const event = PracticeCompletedEventSchema.parse( eventData );
//         const streak = await StreakModel.updateStreak( event.user_id );
        
//         const is_active = streak.current_streak > 0;
//         await publishStreakUpdated({
//             event_id: uuid(),
//             event_type: "streak.updated",
//             event_version: 1,
//             occurred_at: new Date().toISOString(),
//             user_id: event.user_id,
//             payload: {
//                 current_streak: streak.current_streak,
//                 longest_streak: streak.longest_streak,
//                 last_activity_date: streak.last_activity_date,
//                 is_active
//             },
//         });
//     }
// }