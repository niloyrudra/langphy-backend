import { Router } from "express";
import { getSettingsController, createSettingsController, updateSettingsController, validateCreateSettings, validateUpdateSettings } from "../controllers/settings.controller.js";
const router = Router();
router.get("/api/settings/:userId", getSettingsController);
router.post("/api/settings", validateCreateSettings, createSettingsController);
router.put("/api/settings/:userId", validateUpdateSettings, updateSettingsController);
export { router as SettingsRouter };
//# sourceMappingURL=settings.js.map