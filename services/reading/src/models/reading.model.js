import mongoose, { Model, Schema } from "mongoose";
/**
 * 1️⃣ Schema (single source of truth)
 */
const readingLessonSchema = new Schema({
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
    unit_title: {
        type: String,
        required: true
    },
    phrase: {
        type: String,
        required: true
    },
    question_en: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    },
    explanation: {
        type: String,
        required: true
    },
    options: {
        type: [String, String, String, String],
        required: true
    }
}, {
    collection: "readings",
    timestamps: false
});
/**
 * 3️⃣ Typed model
 */
const Reading = mongoose.model("Reading", readingLessonSchema);
export { Reading };
//# sourceMappingURL=reading.model.js.map