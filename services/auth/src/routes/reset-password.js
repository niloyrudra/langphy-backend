import { Router } from "express";
import { body } from 'express-validator';
import { validateAuth } from "../middlewares/validate-auth.js";
import { resetPasswordByEmailController } from "../controllers/reset-password.controller.js";
const router = Router();
router.post("/api/users/reset-password", [
    body('email')
        .isEmail()
        .withMessage('Email must be valid!'),
    body('newPassword')
        .trim()
        .isLength({
        min: 4,
        max: 20
    })
        .withMessage('Password must be between 4 and 20 characters')
], validateAuth, resetPasswordByEmailController);
export { router as resetPasswordByEmailRouter };
//# sourceMappingURL=reset-password.js.map