import type { Request, Response } from "express";

export const signoutController = (_req: Request, res: Response) => {
    res.status(200).send({
        message: "Sign out successful",
        token: null
    });
};
