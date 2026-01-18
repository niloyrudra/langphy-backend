import { Router } from "express";
import { getProfileController } from "../controllers/profile.controller.js";

const router = Router();

router.get( "/api/profile/:user_id", getProfileController );

export { router as ProfileRouter };