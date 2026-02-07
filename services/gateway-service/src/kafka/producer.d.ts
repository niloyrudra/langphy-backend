import { type BaseEvent } from "@langphy/shared";
export declare const initProducer: () => Promise<import("kafkajs").Producer | null>;
export declare const publishEvent: (event: BaseEvent) => Promise<void>;
export declare const stopProducer: () => Promise<void>;
//# sourceMappingURL=producer.d.ts.map