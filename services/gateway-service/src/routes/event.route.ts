import { Router } from "express";
import { postEvent } from "../controllers/event.controller.js";
import { requireAuth } from "../middlewares/require-auth.js";

const router = Router();

router.post("/api/events", requireAuth, postEvent);

export { router as eventRouter };