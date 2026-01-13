import { validate } from "uuid";
import type { UserRegisteredEvent } from "./events/user-registered.event.js";
import { kafka } from "./kafka.client.js";
import { TOPICS } from "./topics.js";
import type { UserDeletedEvent } from "./events/user-deleted.event.js";
import type { UserSignedOutEvent } from "./events/user-signed-out.event.js";
import type { UserPasswordChangedEvent } from "./events/user-password-changed.event.js";
// import type { UserRegisteredEvent } from "@langphy/shared/events/user-registered.event.v1";

import type { BaseEvent } from "@langphy/shared/events/base-event.schema.js";
// import type { BaseEvent } from "./events/base-event.js";

let producer: ReturnType<typeof kafka.producer> | null = null;

export const initProducer = async () => {
  let retries = 10;
  producer = kafka.producer();

  while (retries > 0) {
    try {
      await producer.connect();
      console.log("Kafka Producer connected successfully!");
      return;
    } catch (err: any) {
      console.log("Kafka not ready, retrying...", err.message);
      retries--;
      await new Promise(res => setTimeout(res, 3000));
    }
  }

  throw new Error("Kafka not ready after retries");
};

/**
 * Internal low-level sender
 */
export const sendRaw = async (
  topic: string,
  key: string,
  value: unknown
): Promise<void> => {
  if (!producer) {
    throw new Error("Kafka producer not initialized");
  }

  await producer.send({
    topic,
    messages: [
      {
        key,
        value: JSON.stringify(value),
      },
    ],
  });
};

/**
 * Generic event publisher
 * Used by:
 * - outbox publisher
 * - retry publisher
 * - direct publishers (optional)
 */
export const publishEvent = async (event: BaseEvent): Promise<void> => {
  await sendRaw(
    TOPICS.USERS_EVENTS,
    event.user_id,
    event
  );
};
// export const publishEvent = async (
//   event: BaseEvent // { user_id: string }
// ): Promise<void> => {
//   if (!producer) {
//     throw new Error("Kafka producer not initialized");
//   }

//   await producer.send({
//     topic: TOPICS.USERS_EVENTS,
//     messages: [
//       {
//         key: event.user_id,
//         value: JSON.stringify(event),
//       },
//     ],
//   });
// };


/**
 * 
 * @param event 
 * @returns void
 */
const send = async (event: {user_id: string}) => {
  if( !producer ) {
    throw new Error("Kafka producer not initialized");
  }

  await producer.send({
    topic: TOPICS.USERS_EVENTS,
    messages: [
      {
        key: event.user_id,
        value: JSON.stringify(event),
      },
    ],
  });
};

/* =====================
   EVENT PUBLISHERS
===================== */

export const publishUserRegistered = async ( event: UserRegisteredEvent ) => send(event);

export const publishUserDeleted = async ( event: UserDeletedEvent ) => send(event);

export const publishUserSignedOut = async ( event: UserSignedOutEvent ) => send(event);

export const publishUserPasswordChanged = async ( event: UserPasswordChangedEvent ) => send(event);

// export const publishUserRegistered = async (
//   event: UserRegisteredEvent
// ): Promise<void> => {

//   if (!producer) {
//     throw new Error("Kafka producer not initialized");
//   }

//   try {

//     await producer.send({
//       topic: TOPICS.USERS_EVENTS,
//       messages: [
//         {
//           key: event.user_id, // important for partitioning
//           value: JSON.stringify(event),
//         },
//       ],
//     });
//   }
//   catch(err: any) {
//     if (err.type === "LEADER_NOT_AVAILABLE") {
//       console.warn("Kafka leader not available, retrying...");
//       await new Promise(res => setTimeout(res, 1000));
//       return publishUserRegistered(event);
//     }
//     throw err;
//   }
// };
