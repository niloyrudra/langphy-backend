import type { Request, Response } from "express";
import type { AuthRequest } from "../middlewares/require-auth.js";
// import { currentUser } from "../middlewares/current-user.js";
// import { requireAuth } from "../middlewares/require-auth.js";

export const getProfile = async ( req: AuthRequest, res: Response ) => {
    try{
        res.json({
            user: req.user
        });
    }
    catch(err) {
        console.error(err)
    }
}