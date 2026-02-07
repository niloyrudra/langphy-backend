import type { BaseEvent } from "@langphy/shared";
export declare class EventInboxModel {
    static hasProcessed(eventId: string): Promise<boolean>;
    static markProcessed(event: BaseEvent): Promise<void>;
}
//# sourceMappingURL=event.model.d.ts.map