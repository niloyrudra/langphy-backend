import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Producer } from 'kafkajs';

@Injectable()
export class KafkaService {
  private kafka: Kafka;
  private producer: Producer;

  constructor(private config: ConfigService) {
    this.kafka = new Kafka({
      clientId: 'streaks-service',
      brokers: [this.config.get<string>('KAFKA_BROKER', 'kafka-srv:9092')],
    });

    this.producer = this.kafka.producer();
    this.connect();
  }

  async connect() {
    await this.producer.connect();
  }

  async emit(topic: string, message: any) {
    await this.producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
  }
}