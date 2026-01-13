import type { Request, Response, NextFunction } from "express";
import { SettingsModel } from "../models/settings.model.js";
import { body, validationResult, param } from "express-validator";

// Validation middlewares
export const validateCreateSettings = [
    body("user_id")
        .notEmpty()
        .withMessage("user_id is required")
        .isUUID()
        .withMessage("user_id must be a valid UUID"),
    body("theme").optional().isIn(["light", "dark"]).withMessage("theme must be 'light' or 'dark'"),
    body("notifications").optional().isBoolean(),
    body("language").optional().isString(),
];

export const validateUpdateSettings = [
    param("userId").isUUID().withMessage("userId must be a valid UUID"),
    body("theme").optional().isIn(["light", "dark"]),
    body("notifications").optional().isBoolean(),
    body("language").optional().isString(),
];

// Controllers
export const getSettingsController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.params;
        if (!userId) return res.status(400).json({ message: "userId is required" });
        const user_id = typeof userId == 'string' ? userId : '';
        const settings = await SettingsModel.getSettings(user_id);
        if (!settings) return res.status(404).json({ message: "Settings not found" });
        res.status(200).json({ message: "Settings fetched successfully", settings });
    } catch (err) {
        console.error("Get settings error:", err);
        next(err);
    }
};

export const createSettingsController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const settings = await SettingsModel.createSettings(req.body);
        res.status(201).json({ message: "Settings created successfully", settings });
    } catch (err: any) {
        if (err.message.includes("already exist")) {
            return res.status(400).json({ message: err.message });
        }
        console.error("Create settings error:", err);
        next(err);
    }
};

export const updateSettingsController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { userId } = req.params;
        if (!userId) return res.status(400).json({ message: "userId is required" });
        const user_id = typeof userId == 'string' ? userId : '';
        const settings = await SettingsModel.updateSettings(user_id, req.body);
        res.status(200).json({ message: "Settings updated successfully", settings });
    } catch (err) {
        console.error("Update settings error:", err);
        next(err);
    }
};