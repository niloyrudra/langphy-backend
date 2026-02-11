import { pgPool } from "../db/index.js"

interface SessionPerformanceInput {
    userId: string;
    unitId: string;
    sessionType: string;
    sessionKey: string;
    score: number;
    accuracy: number;
    totalDurationMs: number;
    completedAt: string | number;
}

export class SessionPerformanceRepo {
    static async upsert( input: SessionPerformanceInput ) {
        try {
            const result = await pgPool.query(
                `
                INSERT INTO lp_session_performance (
                    user_id,
                    unit_id,
                    session_type,
                    session_key,
                    score,
                    accuracy,
                    total_duration_ms,
                    completed_at
                )
                VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
                ON CONFLICT (user_id, unit_id, session_type)
                DO UPDATE SET
                    session_key = EXCLUDED.session_key,
                    score = EXCLUDED.score,
                    accuracy = EXCLUDED.accuracy,
                    total_duration_ms = EXCLUDED.total_duration_ms,
                    completed_at = EXCLUDED.completed_at,
                    updated_at = now();
                RETURNING 1
                `,
                [
                    input.userId,
                    input.unitId,
                    input.sessionType,
                    input.sessionKey,
                    input.score,
                    input.accuracy,
                    input.totalDurationMs,
                    input.completedAt
                ]
            );
            return result.rows[0] ?? null;
        }
        catch(error) {
            console.error("Session Performance Repo upsert error:", error);
            return null;
        }
    }

    static async getSessionPerformanceByUserAndUnitId( user_id: string, unit_id: string, session_type: string ) {
        try {
            const result = await pgPool.query(
                `
                SELECT *
                FROM lp_session_performance
                WHERE user_id = $1
                    AND unit_id = $2;
                    AND session_type = $3;
                `,
                [
                    user_id,
                    unit_id,
                    session_type
                ]
            );
            return result.rows[0] ?? null;
        }
        catch(error) {
            console.error("Session Performance Repo getSessionPerformanceByUserAndUnitId error:", error);
            return null;
        }
    }
}