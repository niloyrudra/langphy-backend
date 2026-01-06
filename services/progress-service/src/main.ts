import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  // HTTP app (optional – only if you expose health/read endpoints)
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.setGlobalPrefix('api');

  // const configService = app.get(ConfigService);

  // // 🔑 Kafka microservice
  // app.connectMicroservice<MicroserviceOptions>({
  //   transport: Transport.KAFKA,
  //   options: {
  //     client: {
  //       clientId: 'progress-service',
  //       brokers: [
  //         configService.get<string>('KAFKA_BROKER', 'kafka-srv:9092'),
  //       ],
  //     },
  //     consumer: {
  //       groupId: 'progress-consumer',
  //     },
  //   },
  // });

  // // 🔑 THIS IS CRITICAL
  // await app.startAllMicroservices();

  // Optional (health checks, metrics)
  await app.listen(3002);
}
bootstrap();














// const app = await NestFactory.create( AppModule );

// app.enableCors()
// app.setGlobalPrefix('api');

// await app.listen( 3002, () => console.log('Progress Service running on port 3002.') );