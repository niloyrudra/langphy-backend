import { pgPool } from "../db/index.js";

export interface ProgressData {
    category_id: string;
    unit_id: string;
    user_id: string;
    content_type: string;
    content_id: string;
    completed: boolean;
    progress_percent: number;
    score: number;
}

export class ProgressModel {

    static async upsertProgress( data: ProgressData ) {
        const result = await pgPool.query(
            `
            INSERT INTO lp_progress (category_id, unit_id, user_id, content_type, content_id, completed, progress_percent, score)
            VALUES ($1, $2, $3, $4, $5, $6 $7, $8)
            ON CONFLICT (user_id, content_type, content_id)
            DO UPDATE SET
                completed = EXCLUDED.completed,
                score = EXCLUDED.score,
                updated_at = now()
            RETURNING *
            `,
            [
                data.category_id,
                data.unit_id,
                data.user_id,
                data.content_type,
                data.content_id,
                data.completed,
                data.progress_percent,
                data.score
            ]
        );
        return result.rows[0];
    }

    static async getUserProgress(userId: string) {
        const result = await pgPool.query(
            `SELECT * FROM lp_progress WHERE user_id = $1`,
            [userId]
        );
        return result.rows;
    }
}