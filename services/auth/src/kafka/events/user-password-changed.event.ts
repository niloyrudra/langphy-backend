import type { BaseEvent } from "./base-event.js";

export interface UserPasswordChangedEvent extends BaseEvent<{
    forced: boolean; // admin reset vs user initiated
}> {
    event_type: "user.password.changed";
}