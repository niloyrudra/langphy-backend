import { Router } from "express";
import { getStreakController, createStreakController, updateStreakController } from "../controllers/streaks.controller.js";
import { param } from "express-validator";
const router = Router();
router.get("/api/streaks/:userId", param("userId").isUUID(), getStreakController);
router.post("/api/streaks/:userId", param("userId").isUUID(), createStreakController);
router.put("/api/streaks/:userId", param("userId").isUUID(), updateStreakController);
export { router as StreaksRouter };
//# sourceMappingURL=streaks.js.map