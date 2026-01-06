import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { KafkaService } from '../kafka/kafka.service';

@Injectable()
export class StreaksService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly kafka: KafkaService,
    ) {}

    /**
     * Get the streak info for a specific user
     */
    async getStreak(userId: string) {
        return this.prisma.userStreak.findUnique({where: { userId }});
    }

    // Get all streaks
    async getAllStreaks() {
        return this.prisma.userStreak.findMany();
    }

    async updateStreak(userId: string, activityDate: Date) {
        const existing = await this.prisma.userStreak.findUnique({
            where: { userId },
        });

        let currentStreak = 1;
        let longestStreak = 1;

        if (existing) {
            const diffDays = Math.floor(
                (activityDate.getTime() - existing.lastActiveDate.getTime()) /
                (1000 * 60 * 60 * 24),
            );

            if (diffDays === 1) currentStreak = existing.currentStreak + 1;
            else if (diffDays > 1) currentStreak = 1;
            else currentStreak = existing.currentStreak;

            longestStreak = Math.max(existing.longestStreak, currentStreak);
        }

        const streak = existing
        ? await this.prisma.userStreak.update({
                where: { userId },
                data: { currentStreak, longestStreak, lastActiveDate: activityDate },
            })
        : await this.prisma.userStreak.create({
                data: {
                    userId,
                    currentStreak: 1,
                    longestStreak: 1,
                    lastActiveDate: activityDate,
                },
            });

        // 🔥 EMIT EVENT
        await this.kafka.emit('streak.activity.registered', {
            userId,
            currentStreak: streak.currentStreak,
            longestStreak: streak.longestStreak,
            date: activityDate,
        });

        return streak;
    }
}


// import { Injectable, BadRequestException, Logger, Inject } from "@nestjs/common";
// import { PrismaService } from "./prisma.service.js";
// import { Kafka, Producer } from "kafkajs";

// @Injectable()
// export class StreaksService {

//     private readonly logger = new Logger(StreaksService.name);
//     private producer: Producer;

//     constructor(
//         private readonly prisma: PrismaService,
//         @Inject('KAFKA_CLIENT') private readonly kafka: Kafka
//     ) {
//         // Initialize Kafka
//         this.kafka = new Kafka({
//             clientId: 'streaks-service',
//             brokers: ['kafka-srv:9092'], // Kubernetes service
//         });

//         this.producer = this.kafka.producer();
//         this.connectKafka();
//     }

//     private async connectKafka() {
//         try {
//             await this.producer.connect();
//             this.logger.log('Kafka producer connected');
//         } catch (err) {
//             this.logger.error('Kafka connection failed', err);
//         }
//     }

//     /**
//      * Get the streak info for a specific user
//      */
//     async getStreak(userId: string) {
//         return this.prisma.userStreak.findUnique({where: { userId }});
//     }

//     // Get all streaks
//     async getAllStreaks() {
//         return this.prisma.userStreak.findMany();
//     }

//     /**
//      * Update or create user's streak based on activity
//      * - Handles multiple activities in a single day (idempotent)
//      * - Resets streak if missed days
//      * - Ensures UTC normalization
//      */
//     async registerActivity(userId: string, activityDate: Date) {
//         const now = new Date();
//         if (activityDate > now) {
//             throw new BadRequestException("Activity date cannot be in the future");
//         }

//         // Normalize dates to UTC midnight
//         const startOfDay = (date: Date) => new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));

//         const activityDay = startOfDay(activityDate);

//         const existing = await this.prisma.userStreak.findUnique({where: { userId }});

//         let streak;

//         // If no streak exists, create a new one
//         if (!existing) {
//             streak = await this.prisma.userStreak.create({
//                 data: {
//                     userId,
//                     currentStreak: 1,
//                     longestStreak: 1,
//                     lastActiveDate: activityDay
//                 }
//             });
//         }
//         else {
//             const lastDay = startOfDay(new Date(existing.lastActiveDate));
//             const diffTime = activityDay.getTime() - lastDay.getTime();
//             const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
//             let currentStreak = existing.currentStreak;
    
//             if (diffDays === 0) {
//                 // Same day activity, do nothing (idempotent)
//             } else if (diffDays === 1) {
//                 // Consecutive day, increment streak
//                 currentStreak += 1;
//             } else if (diffDays > 1) {
//                 // Missed days, reset streak
//                 currentStreak = 1;
//             }
    
//             streak = await this.prisma.userStreak.update({
//                 where: { userId },
//                 data: {
//                     currentStreak,
//                     longestStreak: Math.max(existing.longestStreak, currentStreak),
//                     lastActiveDate: activityDay
//                 }
//             });
//         }

//         // Produce Kafka event
//         // await this.sendKafkaEvent(userId, streak);

//         return streak;
//     }

//     async updateStreak( userId: string, activityDate: Date ) {
//         const streak = await this.registerActivity( userId, activityDate );
        
//         await this.producer.connect();
//         await this.producer.send({
//             topic: 'streak.activity.registered',
//             messages: [
//                 {
//                     value: JSON.stringify({
//                         userId,
//                         currentStreak: streak.currentStreak,
//                         date: activityDate
//                     })
//                 }
//             ]
//         });

//         return streak;
//     }

//     // Send event to Kafka
//     // private async sendKafkaEvent(userId: string, streakData: any) {
//     //     try {
//     //         await this.producer.send({
//     //             topic: 'user-activity', // single topic for now
//     //             messages: [
//     //             {
//     //                 key: userId,
//     //                 value: JSON.stringify({
//     //                     userId,
//     //                     currentStreak: streakData.currentStreak,
//     //                     longestStreak: streakData.longestStreak,
//     //                     lastActiveDate: streakData.lastActiveDate,
//     //                 }),
//     //             },
//     //             ],
//     //         });

//     //         this.logger.log(`Kafka event sent for user ${userId}`);
//     //     } catch (err) {
//     //         this.logger.error('Failed to send Kafka event', err);
//     //     }
//     // }
// }