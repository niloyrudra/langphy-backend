export interface UserStreak {
    id: string;
    user_id: string;
    current_streak: number;
    longest_streak: number;
    last_activity_date: string | null;
    created_at: Date;
    updated_at: Date;
}
export declare class StreakModel {
    static getStreak(userId: string): Promise<UserStreak | null>;
    static createStreak(userId: string): Promise<UserStreak>;
    static updateStreak(userId: string): Promise<UserStreak>;
}
//# sourceMappingURL=streaks.model.d.ts.map