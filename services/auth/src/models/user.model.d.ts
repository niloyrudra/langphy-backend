export interface User {
    id: string;
    email: string;
    password: string;
    username: string;
    first_name: string | null;
    last_name: string | null;
    created_at: Date;
    updated_at: Date | null;
}
export type PublicUser = Omit<User, "password">;
export interface UpdateUserProfileInput {
    first_name?: string | null;
    last_name?: string | null;
    username?: string;
}
export declare class UserModel {
    static findByEmail(email: string): Promise<User | null>;
    static create(email: string, password: string): Promise<User>;
    static resetPasswordByEmail(email: string, newPassword: string): Promise<PublicUser>;
    static resetPasswordByUserId(userId: string, newPassword: string): Promise<PublicUser>;
    static delete(userId: string): Promise<PublicUser>;
    static update(userId: string, updates: UpdateUserProfileInput): Promise<any>;
}
//# sourceMappingURL=user.model.d.ts.map