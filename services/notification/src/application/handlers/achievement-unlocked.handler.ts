import type { AchievementUnlockedEvent } from "@langphy/shared";
import type { NotificationEventHandler } from "../handle.registery.js";
import { sendPushNotification } from "../../services/push.service.js";
import type { Notification } from "../../controllers/notifications.controller.js";
import { saveNotification } from "../../repos/notifications.repo.js";
import { emitNotificationCreated } from "../../kafka/producer.js";

export class AchievementUnlockedHandler implements NotificationEventHandler<AchievementUnlockedEvent>
{
    supports(eventType: string) {
        return eventType === "achievement.unlocked";
    }

    async handle(event: AchievementUnlockedEvent) {
        const notification = {
            id: crypto.randomUUID(),
            user_id: event.user_id,
            type: "achievement.unlocked",
            title: `🏆 ${event.payload.title}`,
            body: `${event.payload.description}`,
            read: false,
            created_at: new Date().toISOString(),
            data: {
                achievement_id: event.payload.achievement_id,
                icon: event.payload.icon
            },
        } as Notification;

        await saveNotification(notification);
        await emitNotificationCreated(notification);
        
        await sendPushNotification(notification);
    }
}