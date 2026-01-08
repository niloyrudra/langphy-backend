import { pgPool } from "../db/index.js";

export interface UserSettings {
    id: string;
    user_id: string;
    theme: string;
    notifications: boolean;
    language: string;
    created_at: Date;
    updated_at: Date;
}

export interface SettingsData {
    user_id: string;
    theme?: string;
    notifications?: boolean;
    language?: string;
}

export class SettingsModel {

    // Get settings
    static async getSettings(userId: string): Promise<UserSettings | null> {
        const result = await pgPool.query(
            `SELECT * FROM lp_settings WHERE user_id = $1`,
            [userId]
        );
        return result.rows[0] || null;
    }

    // Create settings
    static async createSettings(data: SettingsData): Promise<UserSettings> {
        try {
            const result = await pgPool.query(
                `INSERT INTO lp_settings (user_id, theme, notifications, language)
                 VALUES ($1, COALESCE($2, 'light'), COALESCE($3, true), COALESCE($4, 'en'))
                 RETURNING *`,
                [data.user_id, data.theme, data.notifications, data.language]
            );
            return result.rows[0];
        } catch (err: any) {
            // Handle unique user_id violation (duplicate row)
            if (err.code === "23505") {
                throw new Error("Settings already exist for this user.");
            }
            throw err;
        }
    }

    // Update settings
    static async updateSettings(userId: string, data: SettingsData): Promise<UserSettings> {
        const result = await pgPool.query(
            `UPDATE lp_settings
             SET theme = COALESCE($1, theme),
                 notifications = COALESCE($2, notifications),
                 language = COALESCE($3, language),
                 updated_at = now()
             WHERE user_id = $4
             RETURNING *`,
            [data.theme, data.notifications, data.language, userId]
        );

        if (!result.rows[0]) {
            throw new Error("Settings not found for this user.");
        }

        return result.rows[0];
    }
}