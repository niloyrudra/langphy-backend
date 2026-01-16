import { Kafka } from "kafkajs";

export const kafka = new Kafka({
    clientId: process.env.SERVICE_NAME! ?? 'settings-service',
    brokers: [ process.env.KAFKA_BROKER! || 'kafka-srv:9092' ],
    retry: {
        initialRetryTime: 300,
        retries: 10
    }
});