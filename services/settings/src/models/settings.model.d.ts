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
export declare class SettingsModel {
    static getSettings(userId: string): Promise<UserSettings | null>;
    static createSettings(data: SettingsData): Promise<UserSettings>;
    static createSettingsIfNotExists(user_id: string): Promise<UserSettings>;
    static updateSettings(userId: string, data: SettingsData): Promise<UserSettings>;
}
//# sourceMappingURL=settings.model.d.ts.map