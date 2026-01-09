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
    sound_effect?: boolean;
    speaking_service?: boolean;
    reading_service?: boolean;
    writing_service?: boolean;
    listening_service?: boolean;
    practice_service?: boolean;
    quiz_service?: boolean;
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
                `INSERT INTO lp_settings (user_id,theme,sound_effect,speaking_service,reading_service,writing_service,listening_service,practice_service,quiz_service,notifications,language)
                 VALUES ($1, COALESCE($2, 'light'), COALESCE($3, true), COALESCE($4, true), COALESCE($5, true), COALESCE($6, true), COALESCE($7, true), COALESCE($8, true), COALESCE($9, true), COALESCE($10, true), COALESCE($11, 'en'))
                 RETURNING *`,
                [
                    data.user_id,
                    data.theme,
                    data.sound_effect,
                    data.speaking_service,
                    data.reading_service,
                    data.writing_service,
                    data.listening_service,
                    data.practice_service,
                    data.quiz_service,
                    data.notifications,
                    data.language
                ]
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

    static async createSettingsIfNotExists( user_id: string ): Promise<UserSettings> {
        try {
            const result = await pgPool.query(
                `INSERT INTO lp_settings (user_id, language, theme) VALUES ($1, 'en', 'light') RETURNING * ON CONFLICT (user_id) DO NOTHING`,
                [user_id]
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
                 speaking_service = COALESCE($2, speaking_service),
                 reading_service = COALESCE($3, notifications),
                 writing_service = COALESCE($4, writing_service),
                 listening_service = COALESCE($5, listening_service),
                 practice_service = COALESCE($6, practice_service),
                 quiz_service = COALESCE($7, quiz_service),
                 sound_effect = COALESCE($8, sound_effect),
                 notifications = COALESCE($9, notifications),
                 language = COALESCE($10, language),
                 updated_at = now()
             WHERE user_id = $11
             RETURNING *`,
            [
                data.theme,
                data.speaking_service,
                data.reading_service,
                data.writing_service,
                data.listening_service,
                data.practice_service,
                data.quiz_service,
                data.sound_effect,
                data.notifications,
                data.language,
                userId
            ]
        );

        if (!result.rows[0]) {
            throw new Error("Settings not found for this user.");
        }

        return result.rows[0];
    }
}