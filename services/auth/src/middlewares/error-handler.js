import { CustomError } from "../errors/custom-errors.js";
// import { RequestValidationError } from "../errors/request-validation-errors.js";
// import { DatabaseConnectionErrors } from "../errors/database-connection-errors.js";
export const errorHandler = (err, req, res, next) => {
    // if (err instanceof RequestValidationError) {
    //     // const formattedErrors = err.errors.map((error) => {
    //     //   if (error.type === 'field') {
    //     //     return { message: error.msg, field: error.path };
    //     //   }
    //     // });
    //     // return res.status(400).send({ errors: formattedErrors });
    //     return res.status( err.statusCode ).send({ errors: err.serializeErrors() });
    // }
    // if (err instanceof DatabaseConnectionErrors) {
    //     // return res.status(500).send({ errors: [{ message: err.reason }] });
    //     return res.status( err.statusCode ).send({ errors: err.serializeErrors() });
    // }
    if (err instanceof CustomError)
        return res.status(err.statusCode).send({ errors: err.serializeErrors() });
    res.status(400).send({ errors: [{ message: "Something went wrong!" }] });
};
//# sourceMappingURL=error-handler.js.map