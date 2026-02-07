import {z} from "zod";
import { BaseEventSchema } from "../base-event.schema.js";

export const PracticeCompletedEventSchema = BaseEventSchema.extend({
  event_type: z.literal("practice.completed"),
  event_version: z.literal(1),
  payload: z.object({
    session_key: z.string(),
    total_duration_ms: z.number().int(),
    avg_score: z.number().optional(),
  }),
});

export type PracticeCompletedEvent = z.infer<
  typeof PracticeCompletedEventSchema
>;
