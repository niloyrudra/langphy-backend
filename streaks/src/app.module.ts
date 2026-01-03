import { Module } from "@nestjs/common";
import { StreaksController } from "./controllers/streaks.controller.js";
import { HealthController } from "./controllers/health.controller.js";
import { PrismaService } from "./streaks/prisma.service.js";
import { StreaksService } from "./streaks/streaks.service.js";
import { PrismaModule } from "./streaks/prisma.module.js";

@Module({
    controllers: [StreaksController, HealthController],
    providers: [StreaksService, PrismaService],
    imports: [PrismaModule]
})
export class AppModule {}