import { TOPICS, type BaseEvent, type AchievementUnlockedEvent } from "@langphy/shared";
import { kafka } from "./kafka.client.js";

export let producer: ReturnType<typeof kafka.producer> | null = null;

export const initProducer = async () => {
    let retries = 10;
    producer = kafka.producer();

    while( retries > 0 ) {
        try {
            await producer.connect();
            console.log("Achievements - Kafka Produer connected successfully!");
            return;
        }
        catch(err: any) {
            console.log("Achievements - Kafka not ready, retrying...", err.message);
            retries--;
            await new Promise( res => setTimeout( res, 3000 ) );
        }
    }

    throw new Error("Achievements - Kafka not ready after retries");
};

/**
 * Internal low-level sender
 */
export const sendRaw = async (
    topic: string,
    key: string,
    value: unknown
): Promise<void> => {
    if( !producer ) throw new Error("Achievements - Kafka producer not initialized");

    await producer.send({
        topic,
        messages: [
            {
                key,
                value: JSON.stringify( value )
            },
        ],
    });
};

/**
 * Generic event publisher
 * Used by:
 * - outbox publisher
 * - retry publisher
 * - direct publishers (optional)
 */
export const publishEvent = async ( event: BaseEvent ): Promise<void> => {
    await sendRaw(
        TOPICS.ACHIEVEMENT_UNLOCKED,
        event.user_id,
        event
    );
};

/**
 * 
 * @param event
 * @return void
 * 
 */
export const send = async ( event: {user_id: string} ) => {
    if( !producer ) throw new Error(  "Achievements - Kafka producer not initialized");

    await producer.send({
        topic: TOPICS.ACHIEVEMENTS_UPDATED,
        messages: [
            {
                key: event.user_id,
                value: JSON.stringify( event )
            },
        ],
    });
};

/* =====================
    EVENT PUBLISHERS
===================== */
export const publishAchievementUpdated = async ( event: AchievementUnlockedEvent ) => send( event );