import type { Request, Response } from "express";
// import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

import { UserModel } from "../models/user.model.js";
import { DatabaseConnectionErrors } from "../errors/database-connection-errors.js";
// import { ConflictValidationError } from "../errors/conflict-errors.js";
import { validationResult } from "express-validator";
import { RequestValidationError } from "../errors/request-validation-errors.js";
import { BadRequestError } from "../errors/bad-request-errors.js";
import { publishUserRegistered } from "../kafka/producer.js";

export const signupController = async ( req: Request, res: Response ) => {
    const errors = validationResult(req);
    
    if( ! errors.isEmpty() ) throw new RequestValidationError( errors.array() );
            
    const { email, password } = req.body;

    try {
        const existingUser = await UserModel.findByEmail( email );

        if( existingUser ) {
            throw new BadRequestError( "Email in use!", 400 );
        }

        const user = await UserModel.create( email, password, "email" );
        console.log("✅ User created:", user.id);

        /** KAFKA */
        /**
         * Emit user.registered event
         * This initializes user-related services (profile, settings, etc.)
         * Consumers must be idempotent
         */
        try {
            await publishUserRegistered({
                event_id: uuidv4(),
                event_type: "user.registered",
                event_version: 1,
                occurred_at: new Date().toISOString(),
                user_id: user.id,
                payload: {
                    email,
                    provider: "email",
                },
            });
        }
        catch(eventError) {
            console.error( "Kafka publish failed:", eventError );
        }
        /** KAFKA */
        
        res.status( 201 ).send({
            message: "User created successfully!",
            user: {
                id: user.id,
                email: user.email,
                created_at: user.created_at,
                provider: user.provider
                // username: user.username
                // updated_at: user.updated_at
            }
        });
    }
    catch( err ) {
        console.error( "Signup error:", err );
        // throw new DatabaseConnectionErrors();
        throw err;
    }
}
