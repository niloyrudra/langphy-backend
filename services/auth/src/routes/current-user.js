import { Router } from "express";
import { currentUser } from "../middlewares/current-user.js";
import { requireAuth } from "../middlewares/require-auth.js";
import { getProfile } from "../controllers/profile.controller.js";
const router = Router();
router.get("/api/users/currentuser", currentUser, requireAuth, getProfile);
export { router as currentUserRouter };
//# sourceMappingURL=current-user.js.map