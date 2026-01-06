import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface SessionEndedEvent {
    eventId: string;
    eventType: 'Session.Ended';
    timestamp: string;
    userId: string;
    sessionId: string;
}

export async function handleSessionEndedEvent( event: SessionEndedEvent) {
    const eventExists = await prisma.processedEvent.findUnique({
        where: { eventId: event.eventId },
    });

    if(eventExists) {
        console.log(`Event with ID ${event.eventId} already processed.`);
        return;
    }

    const today = new Date( event.timestamp );
    today.setHours(0, 0, 0, 0);

    const streak = await prisma.userStreak.findUnique({
        where: { userId: event.userId }
    });

    if(!streak) {
        console.log(`No streak found for user ID ${event.userId}.`);
        await prisma.userStreak.create({
            data: {
                userId: event.userId,
                currentStreak: 1,
                longestStreak: 1,
                lastActiveDate: today
            }
        });
    }
    else {
        const lastActiveDate = new Date( streak.lastActiveDate );
        lastActiveDate.setHours(0,0,0,0);

        const diffTime = today.getTime() - lastActiveDate.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        let currentStreak = streak.currentStreak;
        let longestStreak = streak.longestStreak;

        if(diffDays >= 1 && diffDays < 2) currentStreak += 1;
        else if(diffDays >= 2) currentStreak = 1;
        // If diffDays is 0, do nothing (same day activity)

        if(currentStreak > longestStreak) longestStreak = currentStreak;

        await prisma.userStreak.update({
            where: { userId: event.userId },
            data: {
                currentStreak,
                longestStreak,
                lastActiveDate: today
            }
        });
    }

    await prisma.processedEvent.create({
        data: {
            eventId: event.eventId,
            // type: event.eventType,
            processedAt: new Date( event.timestamp ),
            // userId: event.userId
        }
    });
}