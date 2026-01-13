import type { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { PerformanceModel } from "../models/performance.model.js";
import { RequestValidationError } from "../errors/request-validation-errors.js";
import { BadRequestError } from "../errors/bad-request-errors.js";

export const updatePerformanceController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new RequestValidationError(errors.array());
    }

    try {
        const { userId } = req.params;
        const { score } = req.body;

        if (!userId || score === undefined) {
            throw new BadRequestError("User ID and score are required");
        }
        const user_id = typeof userId == 'string' ? userId : '';
        const performance = await PerformanceModel.updatePerformance(
            user_id,
            score
        );

        res.status(200).send({
            message: "Performance updated successfully",
            performance,
        });
    } catch (err) {
        console.error("Update performance error:", err);
        next(err);
    }
};

export const getPerformanceController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            throw new BadRequestError("User ID is required");
        }
        const user_id = typeof userId == 'string' ? userId : '';
        const performance = await PerformanceModel.getPerformance(user_id);

        res.status(200).send({
            performance,
        });
    } catch (err) {
        console.error("Get performance error:", err);
        next(err);
    }
};