import { pgPool } from "../db/index.js"

interface UserAchievementsInput {
    user_id: string;
    achievement_id: string;
    achieved_at: string | number;
}

export class UserAchievementsRepo {
    static async upsert( input: UserAchievementsInput ) {
        try {
            const result = await pgPool.query(
                `
                INSERT INTO lp_user_achievements (
                    user_id,
                    achievement_id,
                    achieved_at
                )
                VALUES ($1,$2,$3)
                ON CONFLICT (user_id, achievement_id)
                DO UPDATE SET
                    achievement_id = EXCLUDED.achievement_id,
                    achieved_at = EXCLUDED.achieved_at,
                RETURNING 1
                `,
                [
                    input.user_id,
                    input.achievement_id,
                    input.achieved_at
                ]
            );
            return result.rows[0] ?? null;
        }
        catch(error) {
            console.error("UserAchievements Repo upsert error:", error);
            return null;
        }
    }

    static async getUserAchievementsByUserId( user_id: string ) {
        try {
            const result = await pgPool.query(
                `
                SELECT *
                FROM lp_user_achievements
                WHERE user_id = $1
                `,
                [ user_id ]
            );
            return result.rows[0] ?? null;
        }
        catch(error) {
            console.error("UserAchievements Repo getUserAchievementsByUserId error:", error);
            return null;
        }
    }

    static async deleteUserAchievementsByUserId(userId: string) {
        try {
            return await pgPool.query(
                `DELETE FROM lp_user_achievements WHERE user_id = $1`,
                [userId]
            );
        }
        catch(error) {
            console.error("deleteUserAchievementsByUserId error:", error);
            return false;
        }
    }
}