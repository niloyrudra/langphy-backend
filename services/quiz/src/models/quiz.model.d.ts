import mongoose, { Model } from "mongoose";
import type { InferSchemaType } from "mongoose";
/**
 * 1️⃣ Schema (single source of truth)
 */
declare const quizSchema: mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    collection: string;
    timestamps: false;
}, {
    _id: string;
    categoryId: string;
    unitId: string;
    unit_title: string;
    level: string;
    difficulty: string;
    question: string;
    answer: string;
    answer_explanation: string;
    options: string[];
}, mongoose.Document<unknown, {}, {
    _id: string;
    categoryId: string;
    unitId: string;
    unit_title: string;
    level: string;
    difficulty: string;
    question: string;
    answer: string;
    answer_explanation: string;
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
    level: string;
    difficulty: string;
    question: string;
    answer: string;
    answer_explanation: string;
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
        level: string;
        difficulty: string;
        question: string;
        answer: string;
        answer_explanation: string;
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
        level: string;
        difficulty: string;
        question: string;
        answer: string;
        answer_explanation: string;
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
    level: string;
    difficulty: string;
    question: string;
    answer: string;
    answer_explanation: string;
    options: string[];
} & Required<{
    _id: string;
}> & {
    __v: number;
}>;
/**
 * 2️⃣ Infer TypeScript type directly from schema
 */
export type QuizDoc = InferSchemaType<typeof quizSchema>;
/**
 * 3️⃣ Typed model
 */
declare const Quiz: Model<QuizDoc>;
export { Quiz };
//# sourceMappingURL=quiz.model.d.ts.map