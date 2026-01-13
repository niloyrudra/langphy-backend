import mongoose, { Model } from "mongoose";
import type { InferSchemaType } from "mongoose";
/**
 * 1️⃣ Schema (single source of truth)
 */
declare const unitSchema: mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    collection: string;
    timestamps: false;
}, {
    _id: string;
    categoryId: string;
    title: string;
    slug: string;
}, mongoose.Document<unknown, {}, {
    _id: string;
    categoryId: string;
    title: string;
    slug: string;
}, {
    id: string;
}, mongoose.ResolveSchemaOptions<{
    collection: string;
    timestamps: false;
}>> & Omit<{
    _id: string;
    categoryId: string;
    title: string;
    slug: string;
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
        title: string;
        slug: string;
    }, {
        id: string;
    }, mongoose.ResolveSchemaOptions<{
        collection: string;
        timestamps: false;
    }>> & Omit<{
        _id: string;
        categoryId: string;
        title: string;
        slug: string;
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
    title: string;
    slug: string;
} & Required<{
    _id: string;
}> & {
    __v: number;
}>;
/**
 * 2️⃣ Infer TypeScript type directly from schema
 */
export type UnitDoc = InferSchemaType<typeof unitSchema>;
/**
 * 3️⃣ Typed model
 */
declare const Unit: Model<UnitDoc>;
export { Unit };
//# sourceMappingURL=unit.model.d.ts.map