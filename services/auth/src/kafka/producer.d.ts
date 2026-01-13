import type { UserRegisteredEvent } from "./events/user-registered.event.js";
import type { UserDeletedEvent } from "./events/user-deleted.event.js";
import type { UserSignedOutEvent } from "./events/user-signed-out.event.js";
import type { UserPasswordChangedEvent } from "./events/user-password-changed.event.js";
import type { BaseEvent } from "@langphy/shared/events/base-event.schema.js";
export declare const initProducer: () => Promise<void>;
/**
 * Internal low-level sender
 */
export declare const sendRaw: (topic: string, key: string, value: unknown) => Promise<void>;
/**
 * Generic event publisher
 * Used by:
 * - outbox publisher
 * - retry publisher
 * - direct publishers (optional)
 */
export declare const publishEvent: (event: BaseEvent) => Promise<void>;
export declare const publishUserRegistered: (event: UserRegisteredEvent) => Promise<void>;
export declare const publishUserDeleted: (event: UserDeletedEvent) => Promise<void>;
export declare const publishUserSignedOut: (event: UserSignedOutEvent) => Promise<void>;
export declare const publishUserPasswordChanged: (event: UserPasswordChangedEvent) => Promise<void>;
//# sourceMappingURL=producer.d.ts.map