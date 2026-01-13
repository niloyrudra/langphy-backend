import { pgPool } from "../db/index.js";
export class StreakModel {
    // Get streak
    static async getStreak(userId) {
        const result = await pgPool.query(`SELECT * FROM lp_streaks WHERE user_id = $1`, [userId]);
        return result.rows[0] || null;
    }
    // Create streak row
    static async createStreak(userId) {
        try {
            const result = await pgPool.query(`INSERT INTO lp_streaks (user_id)
                 VALUES ($1)
                 RETURNING *`, [userId]);
            return result.rows[0];
        }
        catch (err) {
            if (err.code === "23505") {
                throw new Error("Streak already exists for this user");
            }
            throw err;
        }
    }
    // Update streak on daily activity
    static async updateStreak(userId) {
        const result = await pgPool.query(`
            UPDATE lp_streaks
            SET
                current_streak = CASE
                    WHEN last_activity_date = CURRENT_DATE - INTERVAL '1 day'
                        THEN current_streak + 1
                    WHEN last_activity_date = CURRENT_DATE
                        THEN current_streak
                    ELSE 1
                END,
                longest_streak = GREATEST(
                    longest_streak,
                    CASE
                        WHEN last_activity_date = CURRENT_DATE - INTERVAL '1 day'
                            THEN current_streak + 1
                        ELSE 1
                    END
                ),
                last_activity_date = CURRENT_DATE,
                updated_at = now()
            WHERE user_id = $1
            RETURNING *;
            `, [userId]);
        if (!result.rows[0]) {
            throw new Error("Streak not found");
        }
        return result.rows[0];
    }
}
//# sourceMappingURL=streaks.model.js.map