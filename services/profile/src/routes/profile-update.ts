import { Router } from "express";
import { updateProfileController } from "../controllers/profile.controller.js";

const router = Router();

router.put( "/api/profile/update/:id", updateProfileController );

export { router as ProfileUpdateRouter };