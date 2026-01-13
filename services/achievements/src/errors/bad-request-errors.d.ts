import { CustomError } from "./custom-errors.js";
export declare class BadRequestError extends CustomError {
    message: string;
    suppliedStatusCode?: number | undefined;
    statusCode: number;
    constructor(message: string, suppliedStatusCode?: number | undefined);
    serializeErrors(): {
        message: string;
    }[];
}
//# sourceMappingURL=bad-request-errors.d.ts.map