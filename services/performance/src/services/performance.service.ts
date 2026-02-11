import { SessionAttemptRepo } from "../repos/attempt.repo.js";
import { SessionPerformanceRepo } from "../repos/sessionPerformance.repo.js";

interface SessionCompletedEvent {
    user_id: string;
    unit_id: string;
    session_type: string;
    session_key: string;
    score: number;
    accuracy: number;
    total_duration_ms: number;
    occurred_at: number;
};

export const handleSessionCompleted = async ( event: SessionCompletedEvent ) => {
    try {
        const attemptId = await SessionAttemptRepo.insertOnce({
            userId: event.user_id,
            unitId: event.unit_id,
            sessionType: event.session_type,
            sessionKey: event.session_key,
            score: event.score,
            accuracy: event.accuracy,
            totalDurationMs: event.total_duration_ms,
            occurredAt: event.occurred_at
        });

        // Retry -> do nothing
        if( !attemptId ) return { updated: false };

        // New Completion or redo -> replace performance
        await SessionPerformanceRepo.upsert({
            userId: event.user_id,
            unitId: event.unit_id,
            sessionType: event.session_type,
            sessionKey: event.session_key,
            score: event.score,
            accuracy: event.accuracy,
            totalDurationMs: event.total_duration_ms,
            completedAt: event.occurred_at
        });

        return {
            updated: true
        };

    }
    catch(error) {
        console.error("Performance Service handleSessionCompleted error:", error);
        return { updated: false };
    }
}