import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { KafkaModule } from './kafka/kafka.module';
import { StreaksModule } from './streaks/streaks.module';
import { PrismaModule } from './streaks/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // ✅ must be here
    PrismaModule,
    KafkaModule,
    StreaksModule,
  ],
})
export class AppModule {}
