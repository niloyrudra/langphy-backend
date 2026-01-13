import mongoose, { Model, Schema } from "mongoose";
/**
 * 1️⃣ Schema (single source of truth)
 */
const unitSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    categoryId: {
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
    collection: "units",
    timestamps: false
});
/**
 * 3️⃣ Typed model
 */
const Unit = mongoose.model("Unit", unitSchema);
export { Unit };
//# sourceMappingURL=unit.model.js.map