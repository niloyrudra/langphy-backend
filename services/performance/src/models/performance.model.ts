import { pgPool } from "../db/index.js";

export class PerformanceModel {

    static async updatePerformance(userId: string, score: number) {
        const result = await pgPool.query(
            `
            UPDATE lp_performance
            SET
                total_quizzes = total_quizzes + 1,
                avg_score = ((avg_score * total_quizzes) + $1) / (total_quizzes + 1),
                best_score = GREATEST(best_score, $1),
                last_quiz_score = $1,
                updated_at = now()
            WHERE user_id = $2
            RETURNING *
            `,
            [score, userId]
        );
        return result.rows[0];
    }

    static async getPerformance(userId: string) {
        const result = await pgPool.query(
            `SELECT * FROM lp_performance WHERE user_id = $1`,
            [userId]
        );
        return result.rows[0];
    }
}