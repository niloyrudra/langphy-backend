import { pgPool } from "../db/index.js";
export class EventInboxModel {
    static async hasProcessed(eventId) {
        const res = await pgPool.query(`SELECT 1 FROM lp_event_inbox WHERE event_id = $1`, [eventId]);
        return res.rowCount > 0;
    }
    static async markProcessed(event) {
        await pgPool.query(`
        INSERT INTO lp_event_inbox (
            event_id,
            event_type,
            event_version,
            user_id,
            occurred_at,
            payload
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT DO NOTHING
        `, [
            event.event_id,
            event.event_type,
            event.event_version,
            event.user_id,
            event.occurred_at,
            event.payload,
        ]);
    }
}
//# sourceMappingURL=event.model.js.map