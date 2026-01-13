import { CustomError } from "./custom-errors.js";
export declare class NotFoundError extends CustomError {
    statusCode: number;
    constructor();
    serializeErrors(): {
        message: string;
    }[];
}
//# sourceMappingURL=no-find-errors.d.ts.map