import { kafka } from "../kafka.client.js";
import { TOPICS } from "../topics.js";
import { ProfileModel } from "../../models/profile.model.js";

const consumer = kafka.consumer({ groupId: process.env.SERVICE_NAME! ?? 'profile-service' });

export const startUserRegisteredConsumer = async () => {
    await consumer.connect();
    await consumer.subscribe({
        topic: TOPICS.USERS_EVENTS,
        fromBeginning: true
    });

    await consumer.run({
        eachMessage: async ( {message} ) => {
            if( !message.value ) return;

            const event = JSON.parse( message.value.toString() );

            if( event.event_type !== "user.registered" ) return;

            await ProfileModel.createProfileIfNotExists( event.user_id, event.payload.email );

        },
    });
}