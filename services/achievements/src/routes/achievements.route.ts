import { Router } from "express";
import {
    getAchievementsController
} from "../controllers/achievements.controller.js";

const router = Router();

router.get("/api/achievements/:userId", getAchievementsController);

export { router as AchievementsRouter };
