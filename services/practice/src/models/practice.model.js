import mongoose, { Model, Schema } from "mongoose";
/**
 * 1️⃣ Schema (single source of truth)
 */
const practiceSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    categoryId: {
        type: String,
        required: true
    },
    unitId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
}, {
    collection: "practices",
    timestamps: false
});
/**
 * 3️⃣ Typed model
 */
const Practice = mongoose.model("Practice", practiceSchema);
export { Practice };
//# sourceMappingURL=practice.model.js.map