import { Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma.service.js";

@Injectable()
export class StreaksService {
    constructor( private readonly prisma: PrismaService ) {}

    async getStreak( userId: string ) {
        return this.prisma.userStreak.findUnique({
            where: {userId}
        });
    }

    async registerActivity( userId: string, activityDate: Date ) {
        const existing = await this.prisma.userStreak.findUnique({
            where: {userId}
        });

        if(!existing) {
            return this.prisma.userStreak.create({
                data: {
                    userId,
                    currentStreak: 1,
                    longestStreak: 1,
                    lastActiveDate: activityDate
                }
            });
        }

        const last = new Date( existing.lastActiveDate );
        const diffTime = activityDate.getTime() - last.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        let currentStreak = existing.currentStreak;

        if(diffDays >= 1 && diffDays < 2) currentStreak += 1;
        else if(diffDays >= 2) currentStreak = 1;

        return this.prisma.userStreak.update({
            where: {userId},
            data: {
                currentStreak,
                longestStreak: Math.max( existing.longestStreak, currentStreak ),
                lastActiveDate: activityDate
            }
        });

    }
}