import mongoose, { Model } from "mongoose";
import type { InferSchemaType } from "mongoose";
/**
 * 1️⃣ Schema (single source of truth)
 */
declare const categorySchema: mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    collection: string;
    timestamps: false;
}, {
    _id: string;
    title: string;
    slug: string;
    position_at: number;
}, mongoose.Document<unknown, {}, {
    _id: string;
    title: string;
    slug: string;
    position_at: number;
}, {
    id: string;
}, mongoose.ResolveSchemaOptions<{
    collection: string;
    timestamps: false;
}>> & Omit<{
    _id: string;
    title: string;
    slug: string;
    position_at: number;
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
        title: string;
        slug: string;
        position_at: number;
    }, {
        id: string;
    }, mongoose.ResolveSchemaOptions<{
        collection: string;
        timestamps: false;
    }>> & Omit<{
        _id: string;
        title: string;
        slug: string;
        position_at: number;
    } & Required<{
        _id: string;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, {
    _id: string;
    title: string;
    slug: string;
    position_at: number;
} & Required<{
    _id: string;
}> & {
    __v: number;
}>;
/**
 * 2️⃣ Infer TypeScript type directly from schema
 */
export type CategoryDoc = InferSchemaType<typeof categorySchema>;
/**
 * 3️⃣ Typed model
 */
declare const Category: Model<CategoryDoc>;
export { Category };
//# sourceMappingURL=category.model.d.ts.map