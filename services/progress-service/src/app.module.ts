import { Module } from "@nestjs/common";
import { KafkaModule } from "./kafka/kafka.module";
import { PrismaModule } from "./progress/prisma.module";
import { ProgressModule } from "./progress/progress.module";
// import { HealthModule } from "./health/health.module";
// import { PrismaService } from "./progress/prisma.service";
// import { KafkaService } from "./kafka/kafka.service";
// import { ProgressService } from "./progress/progress.service";
// import { ConfigModule } from "@nestjs/config";

@Module({
    imports: [
        // ConfigModule.forRoot({
        //     isGlobal: true
        // }),
        KafkaModule,
        PrismaModule,
        ProgressModule,
    ],
})

export class AppModule {}



// @Module({
//     providers: [PrismaService, KafkaService, ProgressService],
//     imports: [KafkaModule, PrismaModule, ProgressModule, HealthModule]
// })
