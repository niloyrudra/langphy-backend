import { Router } from "express";
import { postEvent } from "../controllers/event.controller.js";
const router = Router();
router.post("/api/events", postEvent);
export { router as eventRouter };
//# sourceMappingURL=event.route.js.map