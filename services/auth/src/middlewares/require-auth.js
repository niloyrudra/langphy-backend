import { BadRequestError } from "../errors/bad-request-errors.js";
export const requireAuth = (req, res, next) => {
    if (!req.currentUser) {
        throw new BadRequestError("Not authorized");
    }
    next();
};
//# sourceMappingURL=require-auth.js.map