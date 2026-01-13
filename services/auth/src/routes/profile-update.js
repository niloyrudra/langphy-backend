import { Router } from "express";
import { body, } from "express-validator";
import { profileUpdateController } from "../controllers/profile-update.controller.js";
import { validateAuth } from "../middlewares/validate-auth.js";
const router = Router();
router.post("/api/users/profile-update", [
    body("first_name")
        .isLength({ min: 2, max: 30 })
        .withMessage('Name must be at least 2 to maximum 30 characters'),
    body("last_name")
        .isLength({ min: 2, max: 30 })
        .withMessage('Name must be at least 2 to maximum 30 characters'),
    body("username")
        .isLength({ min: 2, max: 30 })
        .withMessage('Name must be at least 2 to maximum 30 characters')
        .custom((value, { req }) => {
        let currentVal = req.body.username;
        if (currentVal)
            currentVal = currentVal.toLowerCase().replace("\s", "");
        return value = currentVal;
    }),
], validateAuth, profileUpdateController);
export { router as profileUpdateRouter };
//# sourceMappingURL=profile-update.js.map