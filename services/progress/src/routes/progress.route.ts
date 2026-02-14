import { Router } from "express";
import { body } from "express-validator";

import {
    upsertProgressController,
    getUserProgressController,
    bulkSyncProgressController,
} from "../controllers/progress.controller.js";

const router = Router();

router.post(
    "/api/progress",
    [
        body("category_id").notEmpty(),
        body("unit_id").notEmpty(),
        body("user_id").notEmpty(),
        body("content_type").notEmpty(),
        body("content_id").notEmpty(),
        body("progress_percent").isFloat({ min: 0, max: 100 }),
    ],
    upsertProgressController
);

router.get("/api/progress/:userId", getUserProgressController);

// ✅ Bulk Sync
router.post(
  "/api/progress/bulk-sync/:userId",
  bulkSyncProgressController
);

export { router as ProgressRouter };