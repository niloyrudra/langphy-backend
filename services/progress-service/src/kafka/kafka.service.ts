import { Injectable, OnModuleInit, Inject, Logger, OnModuleDestroy } from "@nestjs/common";
import { Consumer, Kafka, Producer } from "kafkajs";

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private kafka!: Kafka;        // "!" tells TS it will be initialized
  private producer!: Producer;  // same

  async onModuleInit() {
    this.kafka = new Kafka({
      clientId: 'progress-service',
      brokers: ['kafka-srv:9092'], // replace with your broker(s)
    });

    this.producer = this.kafka.producer();
    await this.producer.connect();
  }

  async emit(topic: string, message: any) {
    if (!this.producer) throw new Error('Kafka producer not initialized');

    await this.producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
  }

  async onModuleDestroy() {
    if (this.producer) await this.producer.disconnect();
  }
}

// @Injectable()
// export class KafkaService implements OnModuleInit {
//     private readonly logger = new Logger( KafkaService.name );

//     constructor(@Inject('KAFKA_CONSUMER') private readonly consumer: Consumer) {}

//     async onModuleInit() {
//         await this.startConsumer();
//     }

//     async startConsumer() {
//         try {
//             await this.consumer.subscribe({
//                 topic: 'streak.updated',
//                 fromBeginning: true
//             });

//             await this.consumer.run({
//                 eachMessage: async ({ topic, partition, message }) => {
//                     const value = message.value?.toString();
//                     if (value) {
//                         this.logger.log(`Received message on ${topic}: ${value}`);
//                         // TO_DO
//                         // Here, ProgressService Logic to update DB will be implemented
//                     }
//                 }
//             });
//             this.logger.log('Kafka consumer running...'); 
//         }
//         catch(err) {
//             this.logger.log('Kafka consumer failed to start', err);
//             throw err;
//         }
//     }
// }