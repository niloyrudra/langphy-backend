import { pgPool } from "../db/index.js";
export class ProgressModel {
    static async upsertProgress(data) {
        const result = await pgPool.query(`
            INSERT INTO lp_progress (user_id, content_type, content_id, completed, progress_percent)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (user_id, content_type, content_id)
            DO UPDATE SET
                completed = EXCLUDED.completed,
                progress_percent = EXCLUDED.progress_percent,
                updated_at = now()
            RETURNING *
            `, [
            data.user_id,
            data.content_type,
            data.content_id,
            data.completed,
            data.progress_percent
        ]);
        return result.rows[0];
    }
    static async getUserProgress(userId) {
        const result = await pgPool.query(`SELECT * FROM lp_progress WHERE user_id = $1`, [userId]);
        return result.rows;
    }
}
//# sourceMappingURL=progress.model.js.map