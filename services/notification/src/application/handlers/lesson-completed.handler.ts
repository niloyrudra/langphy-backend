import type { LessonCompletedEvent } from "@langphy/shared";
import type { NotificationEventHandler } from "../handle.registery.js";
import { sendPushNotification } from "../../services/push.service.js";
import type { Notification } from "../../controllers/notifications.controller.js";
import { saveNotification } from "../../repos/notifications.repo.js";
import { emitNotificationCreated } from "../../kafka/producer.js";

export class LessonCompletedHandler implements NotificationEventHandler<LessonCompletedEvent>
{
    supports(eventType: string) {
        return eventType === "lesson.completed";
    }

    async handle(event: LessonCompletedEvent) {
        const notification = {
            id: crypto.randomUUID(),
            user_id: event.user_id,
            type: "lesson.completed",
            title: "Lesson Completed 🎉",
            body: `You scored ${event.payload.score}%`,
            read: false,
            created_at: new Date().toISOString(),
            data: { lessonId: event.payload.lesson_id },
        } as Notification;

        await saveNotification(notification);
        await emitNotificationCreated(notification);
        
        await sendPushNotification(notification);
    }
}