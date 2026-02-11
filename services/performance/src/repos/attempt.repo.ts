import { pgPool } from "../db/index.js";

interface SessionAttemptInput {
    userId: string;
    unitId: string;
    sessionType: string;
    sessionKey: string;
    score: number;
    accuracy: number;
    totalDurationMs: number;
    occurredAt: string | number;
}

export class SessionAttemptRepo {
    static async insertOnce( input: SessionAttemptInput ) {
        try {
            const now = new Date().toISOString();
            const result = await pgPool.query(
                `
                INSERT INTO lp_session_attempts (
                    user_id,
                    unit_id,
                    session_type,
                    session_key,
                    score,
                    accuracy,
                    total_duration_ms,
                    occurred_at,
                    created_at
                )
                VALUES ($1,$2,$3,$4,$5,$6,$7,$8, $9)
                RETURNING id
                `,
                [
                    input.userId,
                    input.unitId,
                    input.sessionType,
                    input.sessionKey,
                    input.score,
                    input.accuracy,
                    input.totalDurationMs,
                    input.occurredAt,
                    now
                ]
            );
            return result.rows[0] ?? null;
        }
        catch(error) {
            console.error("Attempt Repo insertOnce error:", error);
        }
    }
}