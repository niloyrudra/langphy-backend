import mongoose, { Model } from "mongoose";
import type { InferSchemaType } from "mongoose";
/**
 * 1️⃣ Schema (single source of truth)
 */
declare const readingLessonSchema: mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    collection: string;
    timestamps: false;
}, {
    _id: string;
    categoryId: string;
    unitId: string;
    unit_title: string;
    phrase: string;
    question_en: string;
    answer: string;
    explanation: string;
    options: string[];
}, mongoose.Document<unknown, {}, {
    _id: string;
    categoryId: string;
    unitId: string;
    unit_title: string;
    phrase: string;
    question_en: string;
    answer: string;
    explanation: string;
    options: string[];
}, {
    id: string;
}, mongoose.ResolveSchemaOptions<{
    collection: string;
    timestamps: false;
}>> & Omit<{
    _id: string;
    categoryId: string;
    unitId: string;
    unit_title: string;
    phrase: string;
    question_en: string;
    answer: string;
    explanation: string;
    options: string[];
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
        unit_title: string;
        phrase: string;
        question_en: string;
        answer: string;
        explanation: string;
        options: string[];
    }, {
        id: string;
    }, mongoose.ResolveSchemaOptions<{
        collection: string;
        timestamps: false;
    }>> & Omit<{
        _id: string;
        categoryId: string;
        unitId: string;
        unit_title: string;
        phrase: string;
        question_en: string;
        answer: string;
        explanation: string;
        options: string[];
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
    unit_title: string;
    phrase: string;
    question_en: string;
    answer: string;
    explanation: string;
    options: string[];
} & Required<{
    _id: string;
}> & {
    __v: number;
}>;
/**
 * 2️⃣ Infer TypeScript type directly from schema
 */
export type ReadingLessonDoc = InferSchemaType<typeof readingLessonSchema>;
/**
 * 3️⃣ Typed model
 */
declare const Reading: Model<ReadingLessonDoc>;
export { Reading };
//# sourceMappingURL=reading.model.d.ts.map