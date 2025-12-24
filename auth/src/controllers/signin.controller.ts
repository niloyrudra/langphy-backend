import type { Request, Response } from "express";
import  bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { UserModel } from "../models/user.model.js";
import { DatabaseConnectionErrors } from "../errors/database-connection-errors.js";
// import { validationResult } from "express-validator";
// import { RequestValidationError } from "../errors/request-validation-errors.js";
import { Password } from "../services/password.js";
import { BadRequestError } from "../errors/bad-request-errors.js";
import { CustomError } from "../errors/custom-errors.js";

export const signinController = async ( req: Request, res: Response ) => {
    const { email, password } = req.body;
    // const errors = validationResult(req);

    try {
        const user = await UserModel.findByEmail( email );

        // if( !user ) throw new RequestValidationError( errors.array() );
        if (!user) {
            return res.status(401).send({ error: "Invalid credentials" });
        }

        const passwordMatch = await Password.compare( user.password, password );

        // if( !passwordMatch ) return res.status(401).send({ error: "Invalid credentials" });
        if( !passwordMatch ) {
            throw new BadRequestError( "Invalid credentials", 401);
        }

        const userJwt = jwt.sign(
            {
                id: user.id,
                email: user.email
            },
            process.env.JWT_KEY!
        );

        res.status(200).send({
            message: "Signin successful!",
            user: {...user},
            // user: {
            //     id: user.id,
            //     email: user.email,
            //     created_at: user.created_at,
            //     username: user.username,
            //     first_name: user.first_name,
            //     last_name: user.last_name
            // },
            token: userJwt
        });
    }
    catch( err ) {
        console.error( "Signin error: ", err );

        throw new DatabaseConnectionErrors();

        // // Preserve app-level errors
        // if (err instanceof CustomError) {
        //     throw err;
        // }

        // // if( err instanceof DatabaseConnectionErrors ) {
        // throw new DatabaseConnectionErrors();
        // }
    }
}