import type { RetryEnvelope } from "./retry-envelope.js";
export declare const publishToRetry: (envelope: RetryEnvelope) => Promise<void>;
export declare const publishToDLQ: (envelope: RetryEnvelope) => Promise<void>;
//# sourceMappingURL=retry-producer.d.ts.map