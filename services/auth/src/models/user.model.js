import { pgPool } from "../db/index.js";
import { BadRequestError } from "../errors/bad-request-errors.js";
import { Password } from "../services/password.js";
;
export class UserModel {
    static async findByEmail(email) {
        const result = await pgPool.query(`SELECT id, username, email, password, created_at, updated_at, first_name, last_name FROM lp_users WHERE email = $1`, [email]);
        if (result.rowCount === 0)
            return null;
        return result.rows[0];
    }
    static async create(email, password) {
        const hashedPassword = await Password.toHash(password);
        try {
            const result = await pgPool.query(`
                INSERT INTO lp_users (email, password)
                VALUES ($1, $2)
                RETURNING id, email, password, username, created_at
                `, [email, hashedPassword]);
            return result.rows[0];
        }
        catch (err) {
            if (err?.code === "23505") {
                // unique_violation
                throw new Error("EMAIL_IN_USE");
            }
            throw err;
        }
    }
    static async resetPasswordByEmail(email, newPassword) {
        const hashedPassword = await Password.toHash(newPassword);
        try {
            const result = await pgPool.query(`
                UPDATE lp_users
                SET password = $1
                    updated_at = now()
                WHERE email = $2
                RETURNING id, email, username, first_name, last_name, created_at, updated_at
                `, [hashedPassword, email]);
            if (result.rowCount === 0) {
                throw new BadRequestError("User not found!");
            }
            return result.rows[0];
        }
        catch (err) {
            // if (err?.code === "23505") {
            //     // unique_violation
            //     throw new BadRequestError("Email");
            // }
            throw err;
        }
    }
    static async resetPasswordByUserId(userId, newPassword) {
        const hashedPassword = await Password.toHash(newPassword);
        const result = await pgPool.query(`
            UPDATE lp_users
            SET password = $1,
                updated_at = NOW()
            WHERE id = $2
            RETURNING id, email, username, first_name, last_name, created_at, updated_at
            `, [hashedPassword, userId]);
        if (result.rowCount === 0) {
            throw new BadRequestError("User not found!");
        }
        return result.rows[0];
    }
    static async delete(userId) {
        const result = await pgPool.query(`
            DELETE FROM lp_users
            WHERE id = $1
            RETURNING 1
            `, [userId]);
        if (result.rowCount === 0) {
            throw new BadRequestError("Account Deletion failed!");
        }
        return result.rows[0];
    }
    static async update(userId, updates) {
        const fields = [];
        const values = [];
        let index = 1;
        if (updates.first_name !== undefined) {
            fields.push(`first_name = $${index++}`);
            values.push(updates.first_name);
        }
        if (updates.last_name !== undefined) {
            fields.push(`last_name = $${index++}`);
            values.push(updates.last_name);
        }
        if (updates.username !== undefined) {
            fields.push(`username = $${index++}`);
            values.push(updates.username);
        }
        if (fields.length === 0) {
            throw new BadRequestError("No data to update!");
        }
        // const currentDate = new Date();
        // fields.push( `updated_at = $${index++}` );
        // values.push(currentDate);
        const query = `
            UPDATE lp_users
            SET ${fields.join(", ")}
            WHERE id = $${index}
            RETURNING id, email, username, first_name, last_name, created_at, updated_at
        `;
        values.push(userId);
        const result = await pgPool.query(query, values);
        if (result.rowCount === 0) {
            throw new BadRequestError("User not found!");
        }
        return result.rows[0];
    }
}
//# sourceMappingURL=user.model.js.map