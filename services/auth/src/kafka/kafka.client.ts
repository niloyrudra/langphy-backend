import { Kafka } from "kafkajs";

export const kafka = new Kafka({
  clientId: 'auth-service',
  brokers: ["kafka-srv:9092"],
});