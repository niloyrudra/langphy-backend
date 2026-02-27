import type { Response } from "express";
import type { AuthRequest } from "../middlewares/require-auth.js";
import { BadRequestError } from "../errors/bad-request-errors.js";

export const signoutController = (req: AuthRequest, res: Response) => {
    const user = req.user;
    if( !user ) {
        throw new BadRequestError("User is unauthorized!");
    }
    else {
        res.status(200).send({
            message: "Sign out successful",
            token: null
        });
    }
};
