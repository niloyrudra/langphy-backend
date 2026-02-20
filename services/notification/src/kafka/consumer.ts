import { TOPICS } from "@langphy/shared";
import { kafka } from "./kafka.client.js"
import { EventIndexModel } from "../models/eventIndex.model.js";
import { producer } from "./producer.js";
// import { ProgressRepo } from "../repos/notifications.repo.js";
import type { Notification } from "../controllers/notifications.controller.js";
import { sendPushNotification } from "../services/push.service.js";
import { handlers } from "../application/handle.registery.js";

const consumer = kafka.consumer({
    groupId: process.env.SERVICE_NAME + '-group'
});

export const initConsumer = async () => {
    await consumer.connect();

    await consumer.subscribe({
        topic: TOPICS.LESSON_COMPLETED,
        fromBeginning: false
    });

    await consumer.subscribe({
        topic: TOPICS.STREAK_UPDATED,
        fromBeginning: false
    });

    await consumer.run({
        eachMessage: async ({message}) => {
            if(!message.value) return;

            const event = JSON.parse( message.value!.toString() );
            
            // 1️⃣ Idempotency
            if( await EventIndexModel.exists( event.event_id ) ) return;

            const handler = handlers.find( h => h.supports( event.event_type ));

            if( !handler ) return;

            await handler.handle( event );

            await EventIndexModel.markProcessed( event );

            // let notification: Notification | null = null;

            // 2️⃣ Apply Progress logic
            // const result = await ProgressRepo.applyActivity( {
            //     category_id: event.category_id,
            //     unit_id: event.unit_id,
            //     user_id: event.user_id,
            //     content_type: event.content_type,
            //     content_id: event.content_id,
            //     session_key: event.session_key,
            //     lesson_order: event.lesson_order,
            //     completed: event.completed,
            //     score: event.score,
            //     duration_ms: event.duration_ms,
            //     progress_percent: event.progress_percent
            // } ); 

            // 3️⃣ Emit only if meaningful change
            // if (result.updated) {
            //     await producer?.send({
            //         topic: TOPICS.NOTIFICATION_CREATED,
            //         messages: [
            //             {
            //                 key: event.user_id,
            //                 value: JSON.stringify({
            //                     event_id: crypto.randomUUID(),
            //                     event_type: "progress.updated",
            //                     event_version: 1,
            //                     occurred_at: event.occurred_at,
            //                     user_id: event.user_id,
            //                     payload: result.progress,
            //                 }),
            //             },
            //         ],
            //     });
            // }

            // 4️⃣ Mark processed

            // 4️⃣ Mark processed
            // await EventIndexModel.markProcessed({
            //     event_id: event.event_id,
            //     event_type: event.event_type,
            //     event_version: event.event_version,
            //     user_id: event.user_id,
            //     occurred_at: event.occurred_at,
            //     payload: event,
            // });

            // 6️⃣ Send Push
            // await sendPushNotification( notification );

        }
    });

}