import { handleSessionCompleted } from "../services/performance.service.js";
import { EventIndexModel } from "../models/eventIndex.model.js";
import { kafka } from "./kafka.client.js";
import { PerformanceUpdatedEventSchema, TOPICS } from "@langphy/shared";
import { producer } from "./producer.js";

const consumer = kafka.consumer({
    groupId: `${process.env.SERVICE_NAME}-group`
});

export const initConsumer = async () => {
    await consumer.connect();
    
    await consumer.subscribe({
        topic: TOPICS.SESSION_COMPLETED,
        fromBeginning: false
    });

    await consumer.run({
        eachMessage: async ({ message }) => {
            if( !message.value ) return;

            const rawData = JSON.parse( message.value.toString() );
            const event = PerformanceUpdatedEventSchema.parse(rawData);

            const existing = await EventIndexModel.exists( event.event_id );

            if(existing) return;

            const result = await handleSessionCompleted({
                user_id: event.user_id,
                unit_id: event.payload.unit_id,
                session_type: event.payload.session_type,
                session_key: event.payload.session_key,
                score: event.payload.score ?? 0,
                accuracy: event.payload.accuracy ?? 0,
                total_duration_ms: event.payload.total_duration_ms,
                occurred_at: event.payload.occurred_at,
            });

            if(result.updated) {
                await producer?.send({
                    topic: TOPICS.PERFORMANCE_UPDATED,
                    messages: [{
                        key: event.user_id,
                        value: JSON.stringify({
                            event_type: "performance.updated",
                            payload: event.payload
                        }),
                    }],
                });
            }

            await EventIndexModel.markProcessed(event);

        }
    });
};

export const stopConsumer = async () => {
  await consumer.disconnect();
};