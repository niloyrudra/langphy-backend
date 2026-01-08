import type { Request, Response, NextFunction } from "express";
import { AchievementModel } from "../models/achievements.model.js";
import { BadRequestError } from "../errors/bad-request-errors.js";

export const getAchievementsController = async ( req: Request, res: Response, next: NextFunction ) => {
    try {
        const {userId} = req.params;
        if(!userId) throw new BadRequestError("No user id is provides.");
        
        const achievements = await AchievementModel.getUserAchievements( userId );
        res.status(200).json({ achievements });
    }
    catch(err) {
        next(err)
    }
}