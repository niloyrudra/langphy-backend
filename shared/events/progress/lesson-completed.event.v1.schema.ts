import { z } from "zod";

/**
 * lesson.completed.v1
 * Emitted whenever a user lessones in learning
 */
export const LessonCompletedEventSchema = z.object({
    event_id: z.uuid(),
    event_type: z.literal( "lesson.completed" ),
    event_version: z.literal(1),
    user_id: z.uuid(),
    payload: z.object({
        category_id: z.uuid(),
        unit_id: z.uuid(),
        user_id: z.uuid(),
        lesson_id: z.uuid(),
        lesson_type: z.enum(["quiz",  "practice", "reading", "writing", "speaking", "listening"]),
        lesson_text: z.string(),
        occurred_at: z.string().datetime()
    })
});

export type LessonCompletedEvent = z.infer<typeof LessonCompletedEventSchema>;