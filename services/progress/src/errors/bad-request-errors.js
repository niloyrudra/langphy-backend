import { CustomError } from "./custom-errors.js";
export class BadRequestError extends CustomError {
    message;
    suppliedStatusCode;
    statusCode = 400;
    constructor(message, suppliedStatusCode) {
        super(message);
        this.message = message;
        this.suppliedStatusCode = suppliedStatusCode;
        this.statusCode = suppliedStatusCode ?? 400;
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }
    serializeErrors() {
        return [
            {
                message: this.message
            }
        ];
    }
}
//# sourceMappingURL=bad-request-errors.js.map