import { PerformanceModel } from "../models/performance.model.js";
import { kafka } from "./kafka.client.js";
import { ProgressUpdatedEventSchema, TOPICS } from "@langphy/shared";

const consumer = kafka.consumer({
    groupId: `${process.env.SERVICE_NAME}-group`
});

export const initConsumer = async () => {
    await consumer.connect();
    
    await consumer.subscribe({
        topic: TOPICS.PROGRESS_UPDATED,
        fromBeginning: true
    });

    await consumer.run({
        eachMessage: async ({ message }) => {
            if(!message.value) return;

            const raw = JSON.parse( message.value!.toString() );
            const event = ProgressUpdatedEventSchema.parse(raw);

            if(!event.payload.completed) return;

            await PerformanceModel.updateOnCompletion(
                event.user_id,
                event.payload.lesson_type,
                event.payload.score
            );

            console.log(`📊 Performance updated for user ${event.user_id}`);
        },
    });
};

export const stopConsumer = async () => {
  await consumer.disconnect();
};