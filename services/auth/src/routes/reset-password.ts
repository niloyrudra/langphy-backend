import { Router } from "express";
import { body } from 'express-validator';
import { validateAuth } from "../middlewares/validate-auth.js";
import { resetPasswordByEmailController, resetPasswordByUserIdController } from "../controllers/reset-password.controller.js";

const router = Router();

router.put(
    "/api/users/reset-password",
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
    [
        body('user_id')
            .isUUID()
            .withMessage('User Id must be valid!'),
        body('passwrord')
            .trim()
            // .isLength({
            //     min: 4,
            //     max: 20
            // })
            // .withMessage('Password must be between 4 and 20 characters')
    ],
    validateAuth,
    resetPasswordByUserIdController
);

export { router as resetPasswordByEmailRouter };