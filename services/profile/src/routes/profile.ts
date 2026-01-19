import { Router } from "express";
import { getProfileController } from "../controllers/profile.controller.js";
import { param } from "express-validator";

const router = Router();

router.get(
    "/api/profile/:user_id",
    param("user_id").isUUID(),
    getProfileController
);

export { router as ProfileRouter };