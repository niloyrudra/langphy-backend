import { Controller, Get, Param, Post, Body, Logger } from '@nestjs/common';
import { StreaksService } from '../streaks/streaks.service';
import { KafkaService } from '../kafka/kafka.service'; // Your Kafka wrapper/service

@Controller('streaks')
export class StreaksController {
  private readonly logger = new Logger(StreaksController.name);

  constructor(
    private readonly streaksService: StreaksService
    // private readonly kafkaService: KafkaService, // Inject Kafka service
  ) {}

  /** GET user's streak */
  @Get(':userId')
  async getStreak(@Param('userId') userId: string) {
    const streak = await this.streaksService.getStreak(userId);
    if (!streak) return { message: 'No streak found', userId };
    return streak;
  }

  /** POST - update streak (manual trigger) */
  @Post(':userId')
  async registerActivity(@Param('userId') userId: string, @Body() body?: { date?: string }) {
    const activityDate = body?.date ? new Date(body.date) : new Date();
    try {
      const updatedStreak = await this.streaksService.updateStreak(userId, activityDate);
      this.logger.log(`Streak updated for user ${userId}`);
      return updatedStreak;
    } catch (err) {
      this.logger.error('Failed to register streak activity', err);
      return {
        status: 400,
        message: 'Failed to register streak activity',
      };
    }
  }

  /** GET - all streaks (optional) */
  @Get()
  async getAllStreak() {
    return this.streaksService.getAllStreaks();
  }

  /**
   * Kafka listener example:
   * This will be triggered whenever an "activity.completed" event is emitted.
   * It automatically updates the streak for that user.
   */
  async handleActivityCompleted(message: { userId: string; activityType: string }) {
    try {
      await this.streaksService.updateStreak(message.userId, new Date());
      this.logger.log(`Streak updated via Kafka for user ${message.userId} (${message.activityType})`);
    } catch (err) {
      this.logger.error(`Failed to update streak via Kafka for user ${message.userId}`, err);
    }
  }
}