import { Router } from "express";
import { body } from "express-validator";
import { updatePerformanceController, getPerformanceController, } from "../controllers/performance.controller.js";
const router = Router();
router.post("/api/performance/:userId", [body("score").isFloat({ min: 0, max: 100 })], updatePerformanceController);
router.get("/api/performance/:userId", getPerformanceController);
export { router as PerformanceRouter };
//# sourceMappingURL=performance.route.js.map