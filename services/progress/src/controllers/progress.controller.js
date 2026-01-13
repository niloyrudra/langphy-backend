import { validationResult } from "express-validator";
import { ProgressModel } from "../models/progress.model.js";
import { RequestValidationError } from "../errors/request-validation-errors.js";
import { BadRequestError } from "../errors/bad-request-errors.js";
export const upsertProgressController = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new RequestValidationError(errors.array());
    }
    try {
        const { user_id, content_type, content_id, completed, progress_percent, } = req.body;
        if (!user_id || !content_type || !content_id) {
            throw new BadRequestError("Missing required fields");
        }
        const progress = await ProgressModel.upsertProgress({
            user_id,
            content_type,
            content_id,
            completed,
            progress_percent,
        });
        res.status(200).send({
            message: "Progress saved successfully",
            progress,
        });
    }
    catch (err) {
        console.error("Upsert progress error:", err);
        next(err);
    }
};
export const getUserProgressController = async (req, res, next) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            throw new BadRequestError("User ID is required");
        }
        const user_id = typeof userId == 'string' ? userId : '';
        const progress = await ProgressModel.getUserProgress(user_id);
        res.status(200).send({
            user_id: userId,
            progress,
        });
    }
    catch (err) {
        console.error("Get user progress error:", err);
        next(err);
    }
};
//# sourceMappingURL=progress.controller.js.map