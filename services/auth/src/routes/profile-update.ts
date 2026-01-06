import { Router } from "express";
import type { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";

import { RequestValidationError } from "../errors/request-validation-errors.js";
// import { DatabaseConnectionErrors } from "../errors/database-connection-errors.js";
// import { pgPool } from "../db/index.js";
import { profileUpdateController } from "../controllers/profile-update.controller.js";

const router = Router();

router.post(
  "/api/users/profile-update",
  [
    body("first_name")
      .isLength({ min: 2, max: 30 })
      .withMessage('Name must be at least 2 to maximum 30 characters'),
    body("last_name")
      .isLength({ min: 2, max: 30 })
      .withMessage('Name must be at least 2 to maximum 30 characters'),
    body("username")
      .isLength({ min: 2, max: 30 })
      .withMessage('Name must be at least 2 to maximum 30 characters')
      .custom((value, {req}) => {
        let currentVal = req.body.username;
        if( currentVal ) currentVal = currentVal.toLowerCase().replace("\s", "");
        return value = currentVal;
      }),
  ],
  async (req: Request, _res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        throw new RequestValidationError(errors.array());
    }

    next();
  },
  profileUpdateController
);

export { router as profileUpdateRouter };