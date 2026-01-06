import type { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../errors/bad-request-errors.js";

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.currentUser) {
    throw new BadRequestError("Not authorized");
  }

  next();
};
