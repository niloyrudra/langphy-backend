import { sendRaw } from "./producer.js";
import { TOPICS } from "./topics.js";
export const publishToRetry = async (envelope) => {
    await sendRaw(TOPICS.USERS_EVENTS_RETRY, envelope.original_event.user_id, envelope);
};
export const publishToDLQ = async (envelope) => {
    await sendRaw(TOPICS.USERS_EVENTS_DLQ, envelope.original_event.user_id, envelope);
};
//# sourceMappingURL=retry-producer.js.map