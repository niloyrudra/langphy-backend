import type { Request, Response } from "express";
// import { currentUser } from "../middlewares/current-user.js";
// import { requireAuth } from "../middlewares/require-auth.js";

export const getProfile = async ( req: Request, res: Response ) => {
    try{
        res.json({
            user: req.currentUser
        });
    }
    catch(err) {
        console.error(err)
    }
}