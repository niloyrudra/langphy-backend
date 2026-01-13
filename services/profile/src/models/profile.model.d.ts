export interface UserProfile {
    id: string;
    user_id: string;
    username: string;
    first_name: string | null;
    last_name: string | null;
    profile_image: string | null;
    created_at: Date;
    updated_at: Date | null;
}
export interface UserData {
    user_id: string;
    first_name: string;
    last_name: string;
    username: string;
    profile_image: string;
}
export declare class ProfileModel {
    static getProfile(id: string): Promise<UserProfile>;
    static updateProfile(id: string, userData: UserData): Promise<UserProfile>;
    static createProfile(userData: UserData): Promise<UserProfile>;
    static createProfileIfNotExists(user_id: string, email: string): Promise<UserProfile>;
}
//# sourceMappingURL=profile.model.d.ts.map