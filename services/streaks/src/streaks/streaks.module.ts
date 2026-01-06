import { Module } from '@nestjs/common';
import { StreaksService } from './streaks.service';
import { StreaksController } from '../controllers/streaks.controller';
import { PrismaService } from './prisma.service';
import { KafkaModule } from '../kafka/kafka.module';
import { KafkaService } from '../kafka/kafka.service';
import { PrismaModule } from './prisma.module';

@Module({
  imports: [KafkaModule, PrismaModule],
  providers: [StreaksService, KafkaService, PrismaService],
  controllers: [StreaksController],
})
export class StreaksModule {}