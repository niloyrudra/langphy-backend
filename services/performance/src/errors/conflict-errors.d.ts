import { CustomError } from "./custom-errors.js";
export declare class ConflictValidationError extends CustomError {
    statusCode: number;
    reason: string;
    constructor();
    serializeErrors(): {
        message: string;
    }[];
}
//# sourceMappingURL=conflict-errors.d.ts.map