import type { BaseEvent } from "./base-event.js";
export interface UserPasswordChangedEvent extends BaseEvent<{
    forced: boolean;
}> {
    event_type: "user.password.changed";
}
//# sourceMappingURL=user-password-changed.event.d.ts.map