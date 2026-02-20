import { NotificationModel } from "../models/notification.model.js";
import type { Notification } from "../controllers/notifications.controller.js";

export const saveNotification = async (notification: Notification) => {
    try {
        await NotificationModel.upsertNotification(notification);
    }
    catch(error) {
        console.error("saveNotification error:", error);
    }
}