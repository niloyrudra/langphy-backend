import { CustomError } from "../errors/custom-errors.js";
export const errorHandler = (err, _req, res, _next) => {
    if (err instanceof CustomError)
        return res.status(err.statusCode).json({ errors: err.serializeErrors });
    res.status(400).json({ errors: [{ message: "Something went wrong!" }] });
};
//# sourceMappingURL=error-handler.js.map