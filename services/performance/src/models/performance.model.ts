import { pgPool } from "../db/index.js";

type LessonType =
  | "quiz"
  | "practice"
  | "reading"
  | "writing"
  | "speaking"
  | "listening";

export class PerformanceModel {
    static async upsertUser(userId: string) {
        await pgPool.query(
            `
            INSERT INTO user_performance (user_id)
            VALUES ($1)
            ON CONFLICT (user_id) DO NOTHING
            `,
            [userId]
        );
    }

    static async updateOnCompletion(
        userId: string,
        lessonType: LessonType,
        score?: number
    ) {
        await this.upsertUser(userId);

        const incrementColumn = `${lessonType}_completed`;

        let scoreUpdateSQL = "";
        const values: any[] = [userId];

        if (lessonType === "quiz" && score !== undefined) {
            scoreUpdateSQL = `
                , avg_quiz_score =
                    ((COALESCE(avg_quiz_score, 0) * quiz_score_count) + $2)
                    / (quiz_score_count + 1),
                quiz_score_count = quiz_score_count + 1
            `;
            values.push(score);
        }

        if (lessonType === "speaking" && score !== undefined) {
            scoreUpdateSQL = `
                , avg_speaking_score =
                    ((COALESCE(avg_speaking_score, 0) * speaking_score_count) + $2)
                    / (speaking_score_count + 1),
                speaking_score_count = speaking_score_count + 1
            `;
            values.push(score);
        }

        await pgPool.query(
            `
            UPDATE user_performance
            SET
                total_lessons_completed = total_lessons_completed + 1,
                ${incrementColumn} = ${incrementColumn} + 1,
                updated_at = now()
                ${scoreUpdateSQL}
            WHERE user_id = $1
            `,
            values
        );
    }

    static async getSummary(userId: string) {
        const res = await pgPool.query(
            `SELECT * FROM user_performance WHERE user_id = $1`,
            [userId]
        );

        return res.rows[0] ?? null;
    }
}

// import { pgPool } from "../db/index.js";

// export class PerformanceModel {

//     static async updatePerformance(userId: string, score: number) {
//         const result = await pgPool.query(
//             `
//             UPDATE lp_performance
//             SET
//                 total_quizzes = total_quizzes + 1,
//                 avg_score = ((avg_score * total_quizzes) + $1) / (total_quizzes + 1),
//                 best_score = GREATEST(best_score, $1),
//                 last_quiz_score = $1,
//                 updated_at = now()
//             WHERE user_id = $2
//             RETURNING *
//             `,
//             [score, userId]
//         );
//         return result.rows[0];
//     }

//     static async getPerformance(userId: string) {
//         const result = await pgPool.query(
//             `SELECT * FROM lp_performance WHERE user_id = $1`,
//             [userId]
//         );
//         return result.rows[0];
//     }
// }