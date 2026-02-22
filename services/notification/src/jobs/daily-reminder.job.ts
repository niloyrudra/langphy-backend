import cron from "node-cron";
import { pgPool } from "../db/index.js";
import crypto from "crypto";
import { producer } from "../kafka/producer.js";

export const startDailyReminderJob = () => {
    cron.schedule("0 19 * * *", async () => {
        console.log("Running daily reminder job...");

        try {
            const { rows } = await pgPool.query(`
                SELECT user_id
                FROM user_daily_activity
                WHERE last_activity_date < CURRENT_DATE
                OR last_activity_date IS NULL
            `);

            for (const user of rows) {
                await producer?.send({
                    topic: "reminder.triggered.v1",
                    messages: [{
                        key: user.user_id,
                        value: JSON.stringify({
                            event_id: crypto.randomUUID(),
                            event_type: "reminder.triggered",
                            event_version: 1,
                            occurred_at: new Date().toISOString(),
                            user_id: user.user_id,
                            payload: {}
                        })
                    }]
                });
            }

            console.log(`Reminders sent to ${rows.length} users`);
        } catch (err) {
            console.error("Daily reminder job error:", err);
        }
    });
};