export interface UserRegisteredEvent {
    event_id: string;               // uuid
    event_type: "user.registered";
    event_version: number;
    occurred_at: string;            // ISO string
    user_id: string;                // uuid
    payload: {
        email: string;
        provider: "email" | "google" | "facebook" | "apple";
    }
}