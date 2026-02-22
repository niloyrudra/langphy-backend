import {z} from "zod";
import { BaseEventSchema } from "../base-event.schema.js";

export const AchievementUnlockedEventSchema = BaseEventSchema.extend({
    event_id: z.literal("achievement.unlocked.v1"),
    event_version: z.literal(1),
    payload: z.object({
        achievement_id: z.string(),
        title: z.string(),
        description: z.string(),
        icon: z.string(), // icon key
        occured_at: z.string()
    })
});

export type AchievementUnlockedEvent = z.infer<typeof AchievementUnlockedEventSchema>;