export interface BaseEvent<TPayload> {
    event_id: string;               // uuid
    event_version: number;
    occurred_at: string;            // ISO etring
    user_id: string;                // uuid
    payload: TPayload
}