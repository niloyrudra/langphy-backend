import { pgPool } from "../db/index.js"

interface AchievementsInput {
    icon: string;
    title: string;
    description: string;
    created_at: string | number;
}

export class AchievementsRepo {
    static async upsert( input: AchievementsInput ) {
        try {
            const result = await pgPool.query(
                `
                INSERT INTO lp_achievements (
                    icon,
                    title,
                    description,
                    created_at
                )
                VALUES ($1,$2,$3,$4)
                ON CONFLICT ( title )
                DO UPDATE SET
                    title = EXCLUDED.title,
                    description = EXCLUDED.description,
                    created_at = EXCLUDED.created_at,
                RETURNING id
                `,
                [
                    input.icon,
                    input.title,
                    input.description,
                    input.created_at
                ]
            );
            return result.rows[0] ?? null;
        }
        catch(error) {
            console.error("Achievements Repo upsert error:", error);
            return null;
        }
    }

    static async getAchievementsByUserId( user_id: string ) {
        try {
            const result = await pgPool.query(
                `
                SELECT *
                FROM lp_achievements
                WHERE user_id = $1
                `,
                [ user_id ]
            );
            return result.rows[0] ?? null;
        }
        catch(error) {
            console.error("Achievements Repo getAchievementsByUserAndUnitId error:", error);
            return null;
        }
    }

    static async deleteAchievementsByUserId(userId: string) {
        try {
            return await pgPool.query(
                `DELETE FROM lp_achievements WHERE user_id = $1`,
                [userId]
            );
        }
        catch(error) {
            console.error("deleteAchievementsByUserId error:", error);
            return false;
        }
    }
}