// kafka.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka, Consumer, Producer } from 'kafkajs';

@Injectable()
export class KafkaService implements OnModuleInit {
  private kafka: Kafka;
  private producer: Producer;
  private consumer: Consumer;

  constructor() {
    this.kafka = new Kafka({
      clientId: 'streaks-service',
      brokers: ['kafka-srv:9092'], // Kafka brokers | kafka service name in kubenetes config files
    });
    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ groupId: 'streaks-group' });
  }

  async onModuleInit() {
    await this.producer.connect();
    await this.consumer.connect();

    await this.consumer.subscribe({ topic: 'activity.completed', fromBeginning: true });

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const value = message.value?.toString();
        if (!value) return;

        const data = JSON.parse(value);
        // Here, call your controller's Kafka handler or service
        console.log('Kafka message received:', data);
      },
    });
  }

  async emit(topic: string, data: any) {
    await this.producer.send({
      topic,
      messages: [{ value: JSON.stringify(data) }],
    });
  }
}