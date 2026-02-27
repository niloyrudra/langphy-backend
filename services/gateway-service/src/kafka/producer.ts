import { TOPICS, type BaseEvent } from "@langphy/shared";
import { kafka } from "./kafka.client.js";

let producer: ReturnType<typeof kafka.producer> | null = null;

export const initProducer = async () => {
  if( !producer ) return producer;

  producer = kafka.producer({
    allowAutoTopicCreation: false,
    idempotent: true
  });

  let retries = 10;

  while( retries > 0 ) {
    try {
      await producer.connect();
      console.log("✅ Kafka Producer connected");
      return producer;
    }
    catch(error) {
      retries--;
      console.warn("⏳ Kafka producer retrying...", retries);
      await new Promise( (r) => setTimeout(r, 3000) );
    }
  }

  throw new Error("❌ Kafka Event Producer failed to connect");
};

const sendRaw = async (
  topic: string,
  key: string,
  value: unknown
) => {
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

export const publishEvent = async (event: BaseEvent) => {
  const topic = resolveTopic(event.event_type);

  await sendRaw(
    topic,
    event.user_id, // partition key
    event
  );

  console.log(`📤 Published ${event.event_type} → ${topic}`);
};

const resolveTopic = (eventType: string): string => {
  switch (eventType) {
    // case "user.entitlement.updated.v1":
    //   return TOPICS.ENTITLEMENT_UPDATED;

    case "lesson.completed.v1":
      return TOPICS.LESSON_COMPLETED;

    case "session.completed.v1":
      return TOPICS.SESSION_COMPLETED;

    case "progress.updated.v1":
      return TOPICS.PROGRESS_UPDATED;

    case "streak.updated.v1":
      return TOPICS.STREAK_UPDATED;

    case "performance.updated.v1":
      return TOPICS.PERFORMANCE_UPDATED;

    case "notification.created.v1":
      return TOPICS.NOTIFICATION_CREATED;

    case "reminder.triggered.v1":
      return TOPICS.REMINDER_TRIGGERED;

    case "achievement.unlocked.v1":
      return TOPICS.ACHIEVEMENT_UNLOCKED;

    default:
      throw new Error(`Unknown event type: ${eventType}`);
  }
};

export const stopProducer = async () => {
  if (!producer) return;

  await producer.disconnect();
  producer = null;

  console.log("🛑 Kafka Producer disconnected");
};