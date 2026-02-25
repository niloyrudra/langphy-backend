import { kafka } from "./kafka.client.js"
import { SettingsModel } from "../models/settings.model.js";
import { TOPICS, UserRegisteredEventSchema } from "@langphy/shared";

const consumer = kafka.consumer({
    groupId: process.env.SERVICE_NAME! + "-group"
});

export const initSettingsConsumers = async () => {
    await consumer.connect();
    await consumer.subscribe({
        topic: TOPICS.USER_REGISTERED
    });

    console.log( `[${process.env.SERVICE_NAME}] Kafka is connected` );

    await consumer.run({
        eachMessage: async ({ message }) => {
            if (!message.value) {
                console.warn("Empty Kafka message");
                return;
            }

            let event;
            try {
                event = UserRegisteredEventSchema.parse(
                    JSON.parse(message.value.toString())
                );
            } catch (err) {
                console.error("Failed to parse USER_REGISTERED event:", err);
                return;
            }

            console.log("Processing USER_REGISTERED for:", event.user_id);

            try {
                const exists = await SettingsModel.settingsIfNotExists(event.user_id);
                if (exists) {
                    console.log("Settings already exist for:", event.user_id);
                    return;
                }

                const settings = await SettingsModel.createSettingsIfNotExists(event.user_id);
                if (settings) {
                    console.log("✅ Settings created for user:", event.user_id);
                } else {
                    console.warn("⚠️ Settings insert returned nothing (may already exist)");
                }

            } catch (err) {
                console.error("Settings creation failed:", err);
            }
        },
    });
}