import { CustomError } from "./custom-errors.js";
export class RequestValidationError extends CustomError {
    errors;
    statusCode = 400;
    constructor(errors) {
        super("Invalid rquest parameters!");
        this.errors = errors;
        Object.setPrototypeOf(this, RequestValidationError.prototype); // As we extend Error Class
    }
    serializeErrors() {
        return this.errors.map((err) => {
            if (err.type === 'field') {
                return { message: err.msg, field: err.path };
            }
            return { message: err.msg };
        });
    }
}
//# sourceMappingURL=request-validation-errors.js.map