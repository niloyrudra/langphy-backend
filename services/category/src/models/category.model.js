import mongoose, { Schema, Model } from "mongoose";
/**
 * 1️⃣ Schema (single source of truth)
 */
const categorySchema = new Schema({
    _id: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
    },
    position_at: {
        type: Number,
        required: true,
    },
}, {
    collection: "categories",
    timestamps: false,
});
/**
 * 3️⃣ Typed model
 */
const Category = mongoose.model("Category", categorySchema);
export { Category };
//# sourceMappingURL=category.model.js.map