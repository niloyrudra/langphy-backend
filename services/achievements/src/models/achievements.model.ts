import { pgPool } from "../db/index.js";

export class AchievementModel {

    static async getUserAchievements(userId: string) {
        const result = await pgPool.query(
            `
            SELECT a.id, a.code, a.title, a.description, ua.achieved_at
            FROM lp_user_achievements ua
            JOIN lp_achievements a ON a.id = ua.achievement_id
            WHERE ua.user_id = $1
            `,
            [userId]
        );
        return result.rows;
    }

    static async unlockAchievement(userId: string, achievementId: string) {
        try {
            const result = await pgPool.query(
                `
                INSERT INTO lp_user_achievements (user_id, achievement_id)
                VALUES ($1, $2)
                RETURNING *
                `,
                [userId, achievementId]
            );
            return result.rows[0];
        } catch (err: any) {
            if (err.code === "23505") return null; // already unlocked
            throw err;
        }
    }
}