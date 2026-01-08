import type { Request, Response, NextFunction } from "express";
import { StreakModel } from "../models/streaks.model.js";
import { param, validationResult } from "express-validator";

export const getStreakController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ message: "userId is required" });
        }
        const streak = await StreakModel.getStreak(userId);

        if (!streak) {
            return res.status(404).json({ message: "Streak not found" });
        }

        res.status(200).json({
            message: "Streak fetched successfully",
            streak
        });
    } catch (err) {
        console.error("Get streak error:", err);
        next(err);
    }
};

export const createStreakController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ message: "userId is required" });
        }
        const streak = await StreakModel.createStreak(userId);

        res.status(201).json({
            message: "Streak created successfully",
            streak
        });
    } catch (err: any) {
        if (err.message.includes("already exists")) {
            return res.status(400).json({ message: err.message });
        }
        console.error("Create streak error:", err);
        next(err);
    }
};

export const updateStreakController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ message: "userId is required" });
        }
        const streak = await StreakModel.updateStreak(userId);

        res.status(200).json({
            message: "Streak updated successfully",
            streak
        });
    } catch (err) {
        console.error("Update streak error:", err);
        next(err);
    }
};