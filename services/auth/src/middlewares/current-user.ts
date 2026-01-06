import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface UserPayload {
    id: string;
    email: string;
}

declare global {
    namespace Express {
        interface Request {
            currentUser: UserPayload;
        }
    }
}

export const currentUser = (req: Request, res: Response, next: NextFunction) => {
    // Middleware logic here
    const authHeader = req.headers.authorization;

    if( !authHeader || !authHeader.startsWith("Bearer ") ) {
        return next();
    }

    const token = authHeader.replace("Bearer ", "");

    try {

        const payload = jwt.verify(
            token,
            process.env.JWT_SECRET!
        ) as UserPayload;

        req.currentUser = payload;

    }
    catch(err) {
        console.error( "invalid token -> user remains undefined", err );
        throw new Error("invalid token -> user remains undefined");
    }

    next();
}