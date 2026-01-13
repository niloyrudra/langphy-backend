import { Router } from "express";
import { signoutController } from "../controllers/signout.controller.js";
const router = Router();
router.post("/api/users/signout", signoutController);
export { router as signOutRouter };
//# sourceMappingURL=signout.js.map