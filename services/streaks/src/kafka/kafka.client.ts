import { Kafka } from "kafkajs";

export const kafka = new Kafka({
  clientId: process.env.SERVICE_NAME! || "streaks-service",
  brokers: [ process.env.KAFKA_BROKER! || "kafka-srv-9092" ],
});