import mongoose, { Model, Schema } from "mongoose";
/**
 * 1️⃣ Schema (single source of truth)
 */
const quizSchema = new Schema({
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
    level: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        required: true
    },
    question: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    },
    answer_explanation: {
        type: String,
        required: true
    },
    options: {
        type: [String, String, String, String],
        required: true
    },
}, {
    collection: "quizzes",
    timestamps: false
});
/**
 * 3️⃣ Typed model
 */
const Quiz = mongoose.model("Quiz", quizSchema);
export { Quiz };
//# sourceMappingURL=quiz.model.js.map