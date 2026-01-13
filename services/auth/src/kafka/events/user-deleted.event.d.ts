import type { BaseEvent } from "./base-event.js";
export interface UserDeletedEvent extends BaseEvent<{
    reason?: string;
    deleted_by: "user" | "admin" | "system";
}> {
    event_type: "user.deleted";
}
//# sourceMappingURL=user-deleted.event.d.ts.map