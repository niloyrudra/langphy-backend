import { pgPool } from "../db/index.js";
import { BadRequestError } from "../errors/bad-request-errors.js";
import { Password } from "../services/password.js";

export interface User {
    id: string;
    email: string;
    password: string;
    username: string;
    first_name: string | null;
    last_name: string | null;
    provider: string;
    created_at: Date;
    updated_at: Date | null;
};

export type PublicUser = Omit<User, "password">;


export interface UpdateUserProfileInput {
    first_name?: string | null;
    last_name?: string | null;
    username?: string;
}

export class UserModel {
    static async findByEmail( email: string ): Promise<User | null> {
        const result = await pgPool.query(
            `SELECT id, username, email, password, provider, created_at, updated_at, first_name, last_name FROM lp_users WHERE email = $1`,
            [email]
        );

        if( result.rowCount === 0 ) return null;

        return result.rows[ 0 ];
    }

    static async create( email: string, password: string, provider: string ): Promise<User> {
        const hashedPassword = await Password.toHash(password);
        
        try {
            const result = await pgPool.query(
                `
                INSERT INTO lp_users (email, password, provider)
                VALUES ($1, $2, $3)
                RETURNING id, email, password, username, provider, created_at
                `,
                [email, hashedPassword, provider]
            );

            return result.rows[ 0 ];
        }
        catch( err: any ) {
            if (err?.code === "23505") {
                // unique_violation
                throw new Error("EMAIL_IN_USE");
            }
            throw err;
        }
    }

    static async resetPasswordByEmail( email: string, newPassword: string ): Promise<PublicUser> {
        const hashedPassword = await Password.toHash(newPassword);
        
        try {
            const result = await pgPool.query(
                `
                UPDATE lp_users
                SET password = $1
                    updated_at = now()
                WHERE email = $2
                RETURNING id, email, username, first_name, last_name, created_at, updated_at
                `,
                [hashedPassword, email]
            );

            if (result.rowCount === 0) {
                throw new BadRequestError("User not found!");
            }

            return result.rows[ 0 ];
        }
        catch( err: any ) {
            // if (err?.code === "23505") {
            //     // unique_violation
            //     throw new BadRequestError("Email");
            // }
            throw err;
        }
    }

    static async resetPasswordByUserId(
        userId: string,
        newPassword: string
    ): Promise<PublicUser> {
        const hashedPassword = await Password.toHash(newPassword);

        const result = await pgPool.query(
            `
            UPDATE lp_users
            SET password = $1,
                updated_at = NOW()
            WHERE id = $2
            RETURNING id, email, username, first_name, last_name, provider, created_at, updated_at
            `,
            [hashedPassword, userId]
        );

        if (result.rowCount === 0) {
            throw new BadRequestError("User not found!");
        }

        return result.rows[0];
    }

    static async delete(
        userId: string,
    ): Promise<PublicUser> {

        const result = await pgPool.query(
            `
            DELETE FROM lp_users
            WHERE id = $1
            RETURNING 1
            `,
            [userId]
        );

        if (result.rowCount === 0) {
            throw new BadRequestError("Account Deletion failed!");
        }

        return result.rows[0];
    }

    static async update( userId: string, updates: UpdateUserProfileInput) {
        const fields: string[] = [];
        const values: any[] = [];
        let index = 1;

        if( updates.first_name !== undefined ) {
            fields.push( `first_name = $${index++}` );
            values.push( updates.first_name );
        }

        if( updates.last_name !== undefined ) {
            fields.push( `last_name = $${index++}` );
            values.push( updates.last_name );
        }

        if( updates.username !== undefined ) {
            fields.push( `username = $${index++}` );
            values.push( updates.username );
        }

        if( fields.length === 0 ) {
            throw new BadRequestError( "No data to update!" );
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

        const result = await pgPool.query( query, values );

        if( result.rowCount === 0 ) {
            throw new BadRequestError( "User not found!" );
        }

        return result.rows[ 0 ];

    }
}