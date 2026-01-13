import { Router } from "express";
import { getProfileController } from "../controllers/profile.controller.js";
const router = Router();
router.get("/api/profile/:userId", getProfileController);
export { router as ProfileRouter };
//# sourceMappingURL=profile.js.map