import mongoose, { Model, Schema } from "mongoose";
/**
 * 1️⃣ Schema (single source of truth)
 */
const speakingLessonSchema = new Schema({
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
    phrase: {
        type: String,
        required: true
    },
    meaning: {
        type: String,
        required: true
    },
    german_level: {
        type: String,
        required: true
    },
    formality: {
        type: String,
        required: true
    },
    region: {
        type: String,
        required: true
    },
    usage_context: {
        type: String,
        required: true
    }
}, {
    collection: "speaking",
    timestamps: false
});
/**
 * 3️⃣ Typed model
 */
const Speaking = mongoose.model("Speaking", speakingLessonSchema);
export { Speaking };
//# sourceMappingURL=speaking.model.js.map