import { CustomError } from "./custom-errors.js";
export declare class DatabaseConnectionErrors extends CustomError {
    statusCode: number;
    reason: string;
    constructor();
    serializeErrors(): {
        message: string;
    }[];
}
//# sourceMappingURL=database-connection-errors.d.ts.map