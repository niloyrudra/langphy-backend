import type { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
// import { v4 as uuidv4 } from 'uuid';
import { ProgressModel } from "../models/progress.model.js";
import { RequestValidationError } from "../errors/request-validation-errors.js";
import { BadRequestError } from "../errors/bad-request-errors.js";
// import { publishProgressUpdated } from "../kafka/producer.js";

export const upsertProgressController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) throw new RequestValidationError(errors.array());

    try {
        const {
            user_id,
            content_type,
            content_id,
            session_key,
            lesson_order,
            completed,
            score,
            duration_ms,
            progress_percent,
        } = req.body;

        if (!user_id || !content_type || !content_id) {
            throw new BadRequestError("Missing required fields");
        }

        const progress = await ProgressModel.upsertProgress({
            user_id,
            content_type,
            content_id,
            session_key,
            lesson_order,
            completed,
            score,
            duration_ms,
            progress_percent,
        }); // TO-DO

        /**
         * KAFKA
         * 
         * Emit progress.updated event
         * This intialized progress-related services (performance, achievements, etc.)
         * Consumer must be idempotent
         */
        // try {
        //     await publishProgressUpdated({
        //         event_id: uuidv4(),
        //         event_type: "progress.updated",
        //         event_version: 1,
        //         occurred_at: new Date().toISOString(),
        //         user_id: user_id,
        //         payload: {
        //             category_id,
        //             unit_id,
        //             lesson_id: content_id,
        //             lesson_type: content_type,
        //             completed,
        //             progress_percent,
        //             score
        //         }
        //     });
        // }
        // catch(eventError) {
        //     console.error("Progress Kafka publish failed:", eventError);
        // }

        res.status(200).send({
            message: "Progress saved successfully",
            progress,
        });
    } catch (err) {
        console.error("Upsert progress error:", err);
        next(err);
    }
};

export const getUserProgressController = async (
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
        const progress = await ProgressModel.getUserProgress(user_id);

        res.status(200).send({
            message: "Progress data",
            progress,
        });
    } catch (err) {
        console.error("Get user progress error:", err);
        next(err);
    }
};