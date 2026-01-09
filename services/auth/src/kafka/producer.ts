import { kafka } from "./kafka.client.js";
import { TOPICS } from "./topics.js";
// import type { UserRegisteredEvent } from "@langphy/shared/events/user-registered.event.v1";

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

let producer: ReturnType<typeof kafka.producer> | null = null;

// export const initProducer = async () => {
//   producer = kafka.producer();
//   await producer.connect();
// };

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


export const publishUserRegistered = async (
  event: UserRegisteredEvent
): Promise<void> => {

  if (!producer) {
    throw new Error("Kafka producer not initialized");
  }

  try {

    await producer.send({
      topic: TOPICS.USERS_EVENTS,
      messages: [
        {
          key: event.user_id, // important for partitioning
          value: JSON.stringify(event),
        },
      ],
    });
  }
  catch(err: any) {
    if (err.type === "LEADER_NOT_AVAILABLE") {
      console.warn("Kafka leader not available, retrying...");
      await new Promise(res => setTimeout(res, 1000));
      return publishUserRegistered(event);
    }
    throw err;
  }
};
