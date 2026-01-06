import { Module } from "@nestjs/common";
import { ProgressController } from "../controllers/progress.controller";
import { ProgressService } from "./progress.service";
// import { ProgressConsumer } from "./progress.comsumer";
import { KafkaModule } from "../kafka/kafka.module";
import { PrismaModule } from "./prisma.module";
import { PrismaService } from "./prisma.service";

@Module({
    imports: [KafkaModule, PrismaModule],
    controllers: [ProgressController],
    // controllers: [ProgressConsumer],
    providers: [ProgressService, PrismaService]
})

export class ProgressModule {}