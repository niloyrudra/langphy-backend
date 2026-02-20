import { Router } from "express";
import { body, param } from "express-validator";
import { createNotification, getNotification, getNotificationByUserAndType } from "src/controllers/notifications.controller.js";

const router = Router();

router.post(
    "/api/notification/create",
    [
        body("user_id").notEmpty(),
        body("type").notEmpty(),
        body("title").notEmpty(),
        body("body").notEmpty(),
        body("read").isBoolean(),
        body("created_at").isDate(),
        body("data").isJSON().optional()
    ],
    createNotification
);

router.get(
    "/api/notification/:userId",
    [
        param("userId").isUUID()
    ],
    getNotification
);

router.get(
    "/api/notification/:userId/:type",
    [
        param("userId").isUUID(),
        param("type").notEmpty(),
    ],
    getNotificationByUserAndType
);

export { router as NotificationRouter };