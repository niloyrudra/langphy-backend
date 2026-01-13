import { pgPool } from "../db/index.js";
import { publishEvent } from "./producer.js";
export const publishOutboxEvents = async () => {
    const client = await pgPool.connect();
    try {
        const res = await client.query(`
        SELECT * FROM outbox_events
        WHERE published = false
        ORDER BY occurred_at
        LIMIT 50
        FOR UPDATE SKIP LOCKED
    `);
        for (const row of res.rows) {
            const event = {
                event_id: row.id,
                event_type: row.event_type,
                event_version: row.event_version,
                occurred_at: row.occurred_at.toISOString(),
                user_id: row.aggregate_id,
                payload: row.payload,
            };
            try {
                await publishEvent(event);
                await client.query(`UPDATE outbox_events
                SET published = true, published_at = NOW()
                WHERE id = $1`, [row.id]);
            }
            catch (err) {
                await client.query(`UPDATE outbox_events
                SET retry_count = retry_count + 1
                WHERE id = $1`, [row.id]);
            }
        }
    }
    finally {
        client.release();
    }
};
//# sourceMappingURL=outbox-publisher.js.map