import { pgPool } from "../db/index.js";
import { BadRequestError } from "../errors/bad-request-errors.js";
;
export class ProfileModel {
    static async getProfile(id) {
        try {
            const result = await pgPool.query(`SELECT id, user_id, username, first_name, last_name, profile_image, created_at FROM lp_profiles WHERE id = $1`, [id]);
            return result.rows[0];
        }
        catch (err) {
            console.error("Get profile error:", err);
            // if (err?.code === "23505") {
            // unique_violation
            // throw new Error("Fetching profile data error", err);
            // }
            throw err;
        }
    }
    static async updateProfile(id, userData) {
        // const existing = await pgPool.query(
        //     `SELECT id FROM lp_profiles WHERE username = $1`,
        //     [userData.username]
        // );
        // if (existing.rows.length && existing.rows[0].id !== id) {
        //     throw new Error("Username already exists");
        // }
        try {
            const result = await pgPool.query(`
                UPDATE lp_profiles
                SET
                    username = $1,
                    first_name = $2,
                    last_name = $3,
                    profile_image = $4,
                    updated_at = now()
                WHERE id = $5
                RETURNING id, user_id, username, first_name, last_name, profile_image, created_at, updated_at
                `, [
                userData.username,
                userData.first_name,
                userData.last_name,
                userData.profile_image,
                id,
            ]);
            if (!result.rows[0]) {
                throw new Error("Profile not found");
            }
            return result.rows[0];
        }
        catch (err) {
            console.error("Update profile error:", err);
            // Handle unique username violation gracefully
            if (err.code === "23505") {
                throw new Error("Username already exists. Choose another username.");
            }
            throw err;
        }
    }
    static async createProfile(userData) {
        try {
            const result = await pgPool.query("INSERT INTO lp_profiles (user_id, username, first_name, last_name, profile_image) VALUES ($1,$2,$3,$4,$5) RETURNING id,user_id,username,first_name,last_name,created_at", [
                userData.user_id,
                userData.username,
                userData.first_name,
                userData.last_name,
                userData.profile_image,
            ]);
            return result.rows[0];
        }
        catch (err) {
            console.error("Create profile error:", err);
            // if (err?.code === "23505") {
            // unique_violation
            // throw new Error("Create profile error", err);
            // }
            throw err;
        }
    }
    static async createProfileIfNotExists(user_id, email) {
        try {
            const result = await pgPool.query(`INSERT INTO lp_profiles (user_id, username) VALUES ($1, $2) RETURNING * ON CONFLICT (user_id) DO NOTHING`, [user_id, email]);
            return result.rows[0];
        }
        catch (err) {
            console.error("Create profile error:", err);
            // if (err?.code === "23505") {
            // unique_violation
            // throw new Error("Create profile error", err);
            // }
            throw err;
        }
    }
}
//# sourceMappingURL=profile.model.js.map