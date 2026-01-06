import { Module, Global } from '@nestjs/common';
import { KafkaService } from './kafka.service';

@Global()
@Module({
  providers: [KafkaService],
  exports: [KafkaService],
})
export class KafkaModule {}

// import { Module } from '@nestjs/common';
// import { ClientsModule, Transport } from '@nestjs/microservices';
// import { ConfigModule, ConfigService } from '@nestjs/config';

// @Module({
//   imports: [
//     // 🔑 THIS MUST BE HERE
//     ConfigModule,

//     ClientsModule.registerAsync([
//       {
//         name: 'KAFKA_CLIENT',
//         imports: [ConfigModule], // 🔑 DOUBLE GUARANTEE
//         inject: [ConfigService],
//         useFactory: (configService: ConfigService) => ({
//           transport: Transport.KAFKA,
//           options: {
//             client: {
//               clientId: 'progress-service',
//               brokers: [
//                 configService.get<string>('KAFKA_BROKER', 'kafka-srv:9092'),
//               ],
//             },
//             consumer: {
//               groupId: 'progress-consumer',
//             },
//           },
//         }),
//       },
//     ]),
//   ],
//   exports: ['KAFKA_CLIENT'],
// })
// export class KafkaModule {}