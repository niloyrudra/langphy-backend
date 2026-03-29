import { initConsumer, stopConsumer } from "./consumer.js";

export async function startKafka() {
  console.log("🔌 Starting Achievements Kafka subsystem");
  await initConsumer();
  console.log("✅ Achievements Kafka ready");
}

export async function stopKafka() {
  console.log("🛑 Stopping Achievements Kafka subsystem");
  await stopConsumer();
}