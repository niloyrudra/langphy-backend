import { Router } from "express";
// import bcrypt from 'bcrypt';
// import { pgPool } from "../db/index.js";
import type { NextFunction, Request, Response } from "express";
import { body, validationResult } from 'express-validator';
import { RequestValidationError } from "../errors/request-validation-errors.js";
// import { DatabaseConnectionErrors } from "../errors/database-connection-errors.js";
// import { ConflictValidationError } from "../errors/conflict-errors.js";
import { signupController } from "../controllers/signup.controller.js";

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
    async (req: Request, _res: Response, next: NextFunction) => {
        const errors = validationResult(req);

        if( ! errors.isEmpty() ) {
            // return res.status(400).send(errors.array());
            // throw new Error( 'Invalid email and password!' );
            throw new RequestValidationError( errors.array() );
        }

        next();

        /*
        const { email, password } = req.body;

        try {
            // 1️⃣ Check if user already exists
            const existingUser = await pgPool.query(
                'SELECT id FROM users WHERE email = $1',
                [email]
            );

            if (existingUser.rowCount && existingUser.rowCount > 0) {
                // return res.status(409).send({       // Conflict
                //     error: 'User already exists'
                // });
                throw new ConflictValidationError();
            }

            // 2️⃣ Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // 3️⃣ Insert user
            const result = await pgPool.query(
                `
                    INSERT INTO users (email, password)
                    VALUES ($1, $2)
                    RETURNING id, email, created_at
                `,
                [email, hashedPassword]
            );

            // 4️⃣ Respond
            res.status(201).send({
                message: 'User created successfully',
                user: result.rows[0]
            });

        } catch (err) {
            console.error('Signup DB error:', err);
            throw new DatabaseConnectionErrors();
        }
        */

        // throw new DatabaseConnectionErrors();

        // console.log("Signing up a user.", email, password);
        
        // res.send({email, password});
    },
    signupController
);

export { router as signUpRouter };