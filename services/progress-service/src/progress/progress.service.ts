import { Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

@Injectable()
export class ProgressService {
    constructor(private readonly prisma: PrismaService) {}

    async updateProgress(
        userId: string,
        lessonId: string,
    ) {
        return {}
        // await this.prisma.userProgress.upsert({
        //     where: {userId: event.userId},
        //     update: {
        //         totalActivities: { increment: 1 },
        //         lastActivityDate: new Date( event.date )
        //     },
        //     create: {
        //         userId: event.userId,
        //         totalActivities: 1,
        //         lastActivityDate: new Date( event.date )
        //     }
        // });
    }

    async syncStreak( userId: string, streak: any ) {
        return {}
    }

    async handleStreakEvent( event: {
        userId: string,
        date: string,
        currentStreak: number
    } ) {
        await this.prisma.userProgress.upsert({
            where: {userId: event.userId},
            update: {
                totalActivities: { increment: 1 },
                lastActivityDate: new Date( event.date )
            },
            create: {
                userId: event.userId,
                totalActivities: 1,
                lastActivityDate: new Date( event.date )
            }
        });
    }
}