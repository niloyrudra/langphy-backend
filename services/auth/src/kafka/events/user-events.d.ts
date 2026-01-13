import type { BaseEvent } from "./base-event.js";
export type UserRegisteredEvent = BaseEvent<{
    email: string;
    provider: "email" | "google" | "facebook" | "apple";
}> & {
    event_type: "user.registered";
};
export type UserDeletedEvent = BaseEvent<{}> & {
    event_type: "user.deleted";
};
export type UserSignedOutEvent = BaseEvent<{}> & {
    event_type: "user.signed_out";
};
export type UserPasswordChangedEvent = BaseEvent<{
    provider: "email";
}> & {
    event_type: "user.password.changed";
};
//# sourceMappingURL=user-events.d.ts.map