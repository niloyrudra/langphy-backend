import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  // HTTP app (optional – only if you expose health/read endpoints)
  const app = await NestFactory.create(AppModule);

  // ✅ HTTP-only configs
  app.enableCors();
  app.setGlobalPrefix('api');

  const configService = app.get(ConfigService);
  console.log("KAFKA_BROKER=", configService.get('KAFKA_BROKER'));;

  // 🔑 Kafka microservice
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'streaks-service',
        brokers: [
          configService.get<string>('KAFKA_BROKER', 'kafka-srv:9092'),
        ],
      },
      consumer: {
        groupId: 'streaks-consumer',
      },
    },
  });

  // 🔑 THIS IS CRITICAL
  await app.startAllMicroservices();

  // Optional (health checks, metrics)
  await app.listen(3001);
}
bootstrap();
