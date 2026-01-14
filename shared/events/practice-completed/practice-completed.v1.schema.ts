import {z} from "zod";
import { BaseEventSchema } from "../base-event.schema.js";

export const PracticeCompletedEventSchema = BaseEventSchema.extend({
  event_type: z.literal("practice.completed"),
  event_version: z.literal(1),
  payload: z.object({
    lesson_id: z.uuid(),
    completed_at: z.date()
  }),
});

export type PracticeCompletedEvent = z.infer<
  typeof PracticeCompletedEventSchema
>;
