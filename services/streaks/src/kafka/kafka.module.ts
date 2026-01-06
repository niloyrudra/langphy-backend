// kafka.module.ts
import { Module, Global } from '@nestjs/common';
import { KafkaService } from './kafka.service';

@Global() // optional, allows KafkaService to be used anywhere without import
@Module({
  providers: [KafkaService],
  exports: [KafkaService], // MUST export the class itself
})
export class KafkaModule {}