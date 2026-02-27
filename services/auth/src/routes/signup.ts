import { Router } from "express";
import { body } from 'express-validator';
import { signupController } from "../controllers/signup.controller.js";
import { validateAuth } from "../middlewares/validate-auth.js";

const router = Router();

router.post(
    "/api/users/signup",
    [
        body('email')
            .isEmail()
            .withMessage('Email must be valid!'),
        body('password')
            .trim()
            .isLength({
                min: 4,
                max: 20
            })
            .withMessage('Password must be between 4 and 20 characters')
    ],
    validateAuth,
    signupController
);

export { router as signUpRouter };