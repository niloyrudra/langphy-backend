import type { BaseEvent } from "./base-event.js";
export interface UserSignedOutEvent extends BaseEvent<{
    session_id: string;
    device?: string;
}> {
    event_type: "user.signed_out";
}
//# sourceMappingURL=user-signed-out.event.d.ts.map