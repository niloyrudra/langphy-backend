import type { Request, Response, NextFunction } from "express";
export declare const validateCreateSettings: import("express-validator").ValidationChain[];
export declare const validateUpdateSettings: import("express-validator").ValidationChain[];
export declare const getSettingsController: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createSettingsController: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateSettingsController: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=settings.controller.d.ts.map