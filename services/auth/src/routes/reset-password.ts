import { Router } from "express";
import { body } from 'express-validator';
import { validateAuth } from "../middlewares/validate-auth.js";
import { resetPasswordByEmailController, resetPasswordByUserIdController } from "../controllers/reset-password.controller.js";
import { requireAuth } from "../middlewares/require-auth.js";

const router = Router();

router.put(
    "/api/users/reset-password",
    requireAuth,
    [
        body('email')
            .isEmail()
            .withMessage('Email must be valid!'),
        body('password')
            .trim()
            .isLength({
                min: 6,
                max: 20
            })
            .withMessage('Password must be between 6 and 20 characters')
    ],
    validateAuth,
    resetPasswordByEmailController
);

router.put(
    "/api/users/profile/reset-password",
    requireAuth,
    [
        // body('user_id')
        //     .isUUID()
        //     .withMessage('User Id must be valid!'),
        body('passwrord')
            .notEmpty()
    ],
    validateAuth,
    resetPasswordByUserIdController
);

export { router as resetPasswordByEmailRouter };