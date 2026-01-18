import { Router } from "express";
import { body } from "express-validator";
import { updatePerformanceController } from "../controllers/performance.controller.js";
import { validation } from "../middlewares/validation.js";

const router = Router();

router.get(
    "/api/performance",
    [
        body('user_id')
            .trim()
            .isUUID()
    ],
    validation,
    updatePerformanceController
);

// router.post(
//     "/api/performance/:userId",
//     [body("score").isFloat({ min: 0, max: 100 })],
//     updatePerformanceController
// );

// router.get("/api/performance/:userId", getPerformanceController);

export { router as PerformanceRouter };