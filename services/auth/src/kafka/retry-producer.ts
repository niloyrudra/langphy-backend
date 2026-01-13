import { sendRaw } from "./producer.js";
import type { RetryEnvelope } from "./retry-envelope.js";
import { TOPICS } from "./topics.js";

export const publishToRetry = async (envelope: RetryEnvelope) => {
    await sendRaw(
        TOPICS.USERS_EVENTS_RETRY,
        envelope.original_event.user_id,
        envelope
    );
};

export const publishToDLQ = async (envelope: RetryEnvelope) => {
    await sendRaw(
        TOPICS.USERS_EVENTS_DLQ,
        envelope.original_event.user_id,
        envelope
    );
};