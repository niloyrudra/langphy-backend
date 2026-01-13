import type { BaseEvent } from "./base-event.js";

export interface UserRegisteredEvent extends BaseEvent<{
  email: string;
  provider: "email" | "google" | "facebook" | "apple";
}> {
  event_type: "user.registered";
}