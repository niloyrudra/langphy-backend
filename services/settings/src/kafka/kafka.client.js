import { Kafka } from "kafkajs";
export const kafka = new Kafka({
    clientId: process.env.SERVICE_NAME ?? 'settings-service',
    brokers: ['kafka-srv:9092']
});
//# sourceMappingURL=kafka.client.js.map