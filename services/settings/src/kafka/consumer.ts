// import { UserRegisteredEventSchema } from "@langphy/shared/events";
import { kafka } from "./kafka.client.js"
// import { TOPICS } from "@langphy/shared/events";
import { SettingsModel } from "../models/settings.model.js";
import { TOPICS, UserRegisteredEventSchema } from "@langphy/shared";

const consumer = kafka.consumer({
    groupId: process.env.SERVICE_NAME! + "-group"
});

export const startSettingsConsumers = async () => {
    await consumer.connect();
    await consumer.subscribe({
        topic: TOPICS.USER_REGISTERED
    });

    console.log( `[${process.env.SERVICE_NAME}] Kafka is connected` );

    await consumer.run({
        eachMessage: async ({ message }) => {
            const event = UserRegisteredEventSchema.parse(
                JSON.parse( message.value!.toString() )
            );

            const exists = await SettingsModel.settingsIfNotExists( event.user_id );
            if( exists ) return;

            await SettingsModel.createSettingsIfNotExists( event.user_id );
        },
    });
}