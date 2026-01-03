import { Controller, Get, Param } from '@nestjs/common';
import { PrismaService } from '../streaks/prisma.service';

@Controller('streaks')
export class StreaksController {
  constructor(private readonly prisma: PrismaService) {}

  @Get(':userId')
  async getStreak(@Param('userId') userId: string) {
    return this.prisma.userStreak.findUnique({
      where: { userId }
    });
  }
}