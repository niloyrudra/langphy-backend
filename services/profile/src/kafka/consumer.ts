// import { UserRegisteredEventSchema } from "@langphy/shared/events";
import { kafka } from "./kafka.client.js";
// import { TOPICS } from "@langphy/shared/events";
// import { ProfileModel } from "src/models/profile.model.js";
import { ProfileModel } from "../models/profile.model.js";
import { TOPICS, UserRegisteredEventSchema } from "@langphy/shared";

const consumer = kafka.consumer({
    groupId: process.env.SERVICE_NAME! + '-group'
});

export const startProfileConsumers = async () => {
    await consumer.connect();
    await consumer.subscribe({
        topic: TOPICS.USER_REGISTERED,
    });

    console.log(`[${process.env.SERVICE_NAME}] Kafka is connected`);

    await consumer.run({
        eachMessage: async ({ message }) => {
            const event = UserRegisteredEventSchema.parse(
                JSON.parse( message.value!.toString() )
            );
            try {
                const exists = await ProfileModel.profileIfNotExists( event.user_id );
                if( exists ) return;
    
                await ProfileModel.createProfileIfNotExists( event.user_id, event.payload.email );
                console.log("✅ Profile created for user:", event.user_id);
            }
            catch(err) {
                console.error("Profile creation failed:", err);
                console.error("ℹ️ Profile already exists for user:", event.user_id);
                // throw err;
            }
        },
    });

};