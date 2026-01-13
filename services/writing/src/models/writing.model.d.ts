import mongoose, { Model } from "mongoose";
import type { InferSchemaType } from "mongoose";
/**
 * 1️⃣ Schema (single source of truth)
 */
declare const writingLessonSchema: mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    collection: string;
    timestamps: false;
}, {
    _id: string;
    categoryId: string;
    unitId: string;
    phrase: string;
    meaning: string;
    german_level: string;
    formality: string;
    region: string;
    usage_context: string;
}, mongoose.Document<unknown, {}, {
    _id: string;
    categoryId: string;
    unitId: string;
    phrase: string;
    meaning: string;
    german_level: string;
    formality: string;
    region: string;
    usage_context: string;
}, {
    id: string;
}, mongoose.ResolveSchemaOptions<{
    collection: string;
    timestamps: false;
}>> & Omit<{
    _id: string;
    categoryId: string;
    unitId: string;
    phrase: string;
    meaning: string;
    german_level: string;
    formality: string;
    region: string;
    usage_context: string;
} & Required<{
    _id: string;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    [path: string]: mongoose.SchemaDefinitionProperty<undefined, any, any>;
} | {
    [x: string]: mongoose.SchemaDefinitionProperty<any, any, mongoose.Document<unknown, {}, {
        _id: string;
        categoryId: string;
        unitId: string;
        phrase: string;
        meaning: string;
        german_level: string;
        formality: string;
        region: string;
        usage_context: string;
    }, {
        id: string;
    }, mongoose.ResolveSchemaOptions<{
        collection: string;
        timestamps: false;
    }>> & Omit<{
        _id: string;
        categoryId: string;
        unitId: string;
        phrase: string;
        meaning: string;
        german_level: string;
        formality: string;
        region: string;
        usage_context: string;
    } & Required<{
        _id: string;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, {
    _id: string;
    categoryId: string;
    unitId: string;
    phrase: string;
    meaning: string;
    german_level: string;
    formality: string;
    region: string;
    usage_context: string;
} & Required<{
    _id: string;
}> & {
    __v: number;
}>;
/**
 * 2️⃣ Infer TypeScript type directly from schema
 */
export type WritingLessonDoc = InferSchemaType<typeof writingLessonSchema>;
/**
 * 3️⃣ Typed model
 */
declare const Writing: Model<WritingLessonDoc>;
export { Writing };
//# sourceMappingURL=writing.model.d.ts.map