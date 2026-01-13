export interface BaseEvent<TPayload> {
    event_id: string;
    event_version: number;
    occurred_at: string;
    user_id: string;
    payload: TPayload;
}
//# sourceMappingURL=base-event.d.ts.map