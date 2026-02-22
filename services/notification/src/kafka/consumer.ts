import { TOPICS } from "@langphy/shared";
import { kafka } from "./kafka.client.js"
import { EventIndexModel } from "../models/eventIndex.model.js";
import { handlers } from "../application/handle.registery.js";

const consumer = kafka.consumer({
    groupId: process.env.SERVICE_NAME + '-group'
});

export const initConsumer = async () => {
    await consumer.connect();

    await consumer.subscribe({
        topic: TOPICS.USER_REGISTERED,
    });

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
        }
    });

}