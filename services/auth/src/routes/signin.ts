import { Router } from "express";
import type { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";

import { RequestValidationError } from "../errors/request-validation-errors.js";
// import { DatabaseConnectionErrors } from "../errors/database-connection-errors.js";
// import { pgPool } from "../db/index.js";
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

    /*
    const { email, password } = req.body;

    try {
        // 1️⃣ Find user
        const userResult = await pgPool.query(
            "SELECT id, email, password FROM users WHERE email = $1",
            [email]
        );

        if (userResult.rowCount === 0) {
            return res.status(401).send({
                error: "Invalid credentials"
            });
        }

        const user = userResult.rows[0];

        // 2️⃣ Compare password
        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).send({
                error: "Invalid credentials"
            });
        }

        // 3️⃣ Generate JWT
        const userJwt = jwt.sign(
            {
                id: user.id,
                email: user.email
            },
            process.env.JWT_KEY!
        );

        // 4️⃣ Respond
        res.status(200).send({
            message: "Signin successful",
            user: {
                id: user.id,
                email: user.email
            },
            token: userJwt
        });

    } catch (err) {
      console.error("Signin error:", err);
      throw new DatabaseConnectionErrors();
    }
    */
  },
  signinController
);

export { router as signInRouter };