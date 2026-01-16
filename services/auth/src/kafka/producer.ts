import { TOPICS, type BaseEvent, type UserDeletedEvent, type UserPasswordChangedEvent, type UserRegisteredEvent, type UserSignedOutEvent } from "@langphy/shared";
import { kafka } from "./kafka.client.js";

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
    TOPICS.USER_REGISTERED,
    event.user_id,
    event
  );
};

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
    topic: TOPICS.USER_REGISTERED,
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