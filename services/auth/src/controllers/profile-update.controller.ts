import type { Request, Response } from "express";
import { validationResult } from "express-validator";
import { RequestValidationError } from "../errors/request-validation-errors.js";
import { DatabaseConnectionErrors } from "../errors/database-connection-errors.js";
import { UserModel } from "../models/user.model.js";
import { BadRequestError } from "../errors/bad-request-errors.js";

export const profileUpdateController = async ( req: Request, res: Response ) => {
    const errors = validationResult(req);
        
    if( ! errors.isEmpty() ) throw new RequestValidationError( errors.array() );

    const { userId, first_name, last_name, username } = req.body;

    if(!userId) throw new BadRequestError("User Id is required.");

    try {
        const updatedUserInfo = await UserModel.update( userId, {
            first_name,
            last_name,
            username
        });

        res.status( 201 ).send({
            message: "profile updated successfully!",
            user: {
                id: userId,
                username: updatedUserInfo.username,
                first_name: updatedUserInfo.first_name,
                last_name: updatedUserInfo.last_name,
            }
        });
    }
    catch( err ) {
        console.log( "Profile update err:", err );
        throw new DatabaseConnectionErrors();
    }

}