import { Router } from "express";
import type { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { RequestValidationError } from "../errors/request-validation-errors.js";
import { signinController } from "../controllers/signin.controller.js";

const router = Router();

router.post(
  "/api/users/signin",
  [
    body("email")
      .isEmail()
      .withMessage("Email must be valid"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password must be supplied")
  ],
  async (req: Request, _res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        throw new RequestValidationError(errors.array());
    }

    next();
  },
  signinController
);

export { router as signInRouter };