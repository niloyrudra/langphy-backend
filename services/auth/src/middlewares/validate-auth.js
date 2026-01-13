import { validationResult } from "express-validator";
import { RequestValidationError } from "../errors/request-validation-errors.js";
export const validateAuth = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new RequestValidationError(errors.array());
    }
    next();
};
//# sourceMappingURL=validate-auth.js.map