import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { ProgressService } from "./progress.service";

@Controller()
export class ProgressConsumer {
    constructor(private readonly progressService: ProgressService) {}

    // @MessagePattern('lesson.completed')
    async onLessonCompleted(
        // @Payload() message: any,
        message: any,
    ) {
        const { userId, lessonId } = message.value;

        await this.progressService.updateProgress( userId, lessonId );
    }

    // @MessagePattern('streak.update')
    async onStreakUpdate(
        // @Payload() message: any,
        message: any,
    ) {
        const { userId, streak } = message.value;

        await this.progressService.syncStreak(userId, streak);
    }
}