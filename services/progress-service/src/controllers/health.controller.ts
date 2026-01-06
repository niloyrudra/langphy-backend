import { Controller, Get } from "@nestjs/common";
import { PrismaService } from "../progress/prisma.service";

@Controller('health')
export class HealthController {
    constructor(
        private readonly prisma: PrismaService
    ) {}

    @Get()
    async health() {
        return { status: 'ok' }
    }
}