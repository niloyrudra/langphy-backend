import { Router } from "express";
import { body } from "express-validator";
import { upsertProgressController, getUserProgressController, } from "../controllers/progress.controller.js";
const router = Router();
router.post("/api/progress", [
    body("user_id").notEmpty(),
    body("content_type").notEmpty(),
    body("content_id").notEmpty(),
    body("progress_percent").isFloat({ min: 0, max: 100 }),
], upsertProgressController);
router.get("/api/progress/:userId", getUserProgressController);
export { router as ProgressRouter };
//# sourceMappingURL=progress.route.js.map