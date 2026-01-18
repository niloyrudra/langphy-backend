import type { Request, Response } from "express";
// import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

import { UserModel } from "../models/user.model.js";
import { DatabaseConnectionErrors } from "../errors/database-connection-errors.js";
// import { ConflictValidationError } from "../errors/conflict-errors.js";
import { validationResult } from "express-validator";
import { RequestValidationError } from "../errors/request-validation-errors.js";
import { BadRequestError } from "../errors/bad-request-errors.js";
import { publishUserPasswordChanged } from "../kafka/producer.js";

export const resetPasswordByEmailController = async ( req: Request, res: Response ) => {
    const errors = validationResult(req);
    
    if( ! errors.isEmpty() ) throw new RequestValidationError( errors.array() );
            
    const { email, password } = req.body;

    try {
        const existingUser = await UserModel.findByEmail( email );

        if( !existingUser ) {
            throw new BadRequestError( "Email is not in use!" );
        }

        const user = await UserModel.resetPasswordByEmail( email, password );

        /** KAFKA */
        /**
         * Emit user.passwrd.changed event
         * This initializes user-related services (profile, settings, etc.)
         * Consumers must be idempotent
         */
        try {
            await publishUserPasswordChanged({
                event_id: uuidv4(),
                event_type: "user.password.changed",
                event_version: 1,
                occurred_at: new Date().toISOString(),
                user_id: user.id,
                payload: {
                    forced: false
                },
            });
        }
        catch(eventError) {
            console.error( "Kafka publish failed:", eventError );
        }
        /** KAFKA */
        
        res.status( 200 ).send({
            message: "Password reset successfully!",
        });
    }
    catch( err ) {
        console.error( "Password reset failed:", err );
        // throw new DatabaseConnectionErrors();
        throw err;
    }
};

export const resetPasswordByUserIdController = async ( req: Request, res: Response ) => {
    const errors = validationResult( req );
    if( ! errors.isEmpty() ) throw new RequestValidationError( errors.array() );
    const { password, user_id } = req.body;
    try {
        const user = await UserModel.resetPasswordByUserId( user_id, password );
        /** KAFKA */
        /**
         * Emit user.passwrd.changed event
         * This initializes user-related services (profile, settings, etc.)
         * Consumers must be idempotent
         */
        try {
            await publishUserPasswordChanged({
                event_id: uuidv4(),
                event_type: "user.password.changed",
                event_version: 1,
                occurred_at: new Date().toISOString(),
                user_id: user.id,
                payload: {
                    forced: false
                },
            });
        }
        catch(eventError) {
            console.error( "Auth - Kafka publish failed:", eventError );
        }
        /** KAFKA */

        res.status(200).json({ message: "Password changed successfully!" });
    }
    catch(err) {
        console.error( "Password reset by user id failed", err );
        throw err;
    }
};
