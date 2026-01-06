import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProgressService } from '../progress/progress.service';

@Controller()
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  // 🔑 Kafka topic name
  @MessagePattern('lesson.progress.updated')
  async handleProgressUpdate(@Payload() data: any) {
    const { userId, lessonId } = data.value;
    return this.progressService.updateProgress(userId, lessonId);
  }
}