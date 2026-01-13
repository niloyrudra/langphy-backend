import { SettingsModel } from "../../models/settings.model.js";
import { kafka } from "../kafka.client.js";
import { TOPICS } from "../topics.js";
const consumer = kafka.consumer({ groupId: process.env.SERVICE_NAME ?? 'settings-service' });
export const startUserRegisteredConsumer = async () => {
    await consumer.connect();
    await consumer.subscribe({
        topic: TOPICS.USERS_EVENTS,
        fromBeginning: true
    });
    await consumer.run({
        eachMessage: async ({ message }) => {
            if (!message.value)
                return;
            const event = JSON.parse(message.value.toString());
            if (event.event_type !== "user.registered")
                return;
            await SettingsModel.createSettingsIfNotExists(event.user_id);
        },
    });
};
//# sourceMappingURL=user-registered.consumer.v1.js.map