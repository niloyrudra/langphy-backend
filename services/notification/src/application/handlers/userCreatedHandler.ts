import type { UserRegisteredEvent } from "@langphy/shared";
import type { NotificationEventHandler } from "../handle.registery.js";
// import { sendPushNotification } from "../../services/push.service.js";
import type { Notification } from "../../controllers/notifications.controller.js";
import { saveNotification } from "../../repos/notifications.repo.js";
import { emitNotificationCreated } from "../../kafka/producer.js";
import { sendExpoPush } from "src/repos/push-notification.repo.js";
import { upsertUserDailyActivity } from "src/services/user-daily-activity.service.js";

export class UserRegisteredHandler implements NotificationEventHandler<UserRegisteredEvent>
{
    supports(eventType: string) {
        return eventType === "user.registered";
    }

    async handle(event: UserRegisteredEvent) {
        const notification = {
            id: crypto.randomUUID(),
            user_id: event.user_id,
            type: "user.registered",
            title: "Coongratulations! 🎉",
            body: `You are registered to Langhy using this email: ${event.payload.email}%`,
            read: false,
            created_at: new Date().toISOString(),
            data: { email: event.payload.email, provider: event.payload.provider },
        } as Notification;

        await saveNotification(notification);
        await emitNotificationCreated(notification);
        
        // await sendPushNotification(notification);
        await sendExpoPush(notification);

        // Upsert user daily activity
        await upsertUserDailyActivity( event.user_id );
    }
}