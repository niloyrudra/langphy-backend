import { TOPICS } from "@langphy/shared/events/topics.js";
import { UserRegisteredEventSchema } from "@langphy/shared/events";
import { kafka } from "./kafka.client.js";

const consumer = kafka.consumer( { groupId: process.env.SERVICE_NAME + '-group' } );
const producer = kafka.producer();

const MAX_RETRIES = 3;

export const initConsumer = async ( topic: string, handler: ( payload: any ) => Promise<void> ) => {
    await consumer.connect();
    await producer.connect();

    console.log( `[${process.env.SERVICE_NAME}] Kafka consumer connected` );
    await consumer.subscribe({
        topic
    });

    await consumer.run({
        eachMessage: async ({ message }) => {
            const retries = parseInt( message.headers?.retries?.toString() || "0" );
            try {
                const payload = JSON.parse( message.value!.toString() );
                await handler(payload);
            }
            catch(err) {
                console.error( `[${process.env.SERVICE_NAME}] Error processing message`, err );
                if( retries < MAX_RETRIES ) {
                    await producer.send({
                        topic,
                        messages: [
                            {
                                value: message.value!,
                                headers: {
                                    retries: `${retries + 1}`
                                }
                            }
                        ]
                    });
                }
                else {
                    await producer.send({
                        topic: topic + ".dlq",
                        messages: [
                            {value: message.value!}
                        ]
                    });
                }
            }
        }
    });

};

export const startConsumer = async () => {
  const consumer = kafka.consumer({
    groupId: process.env.SERVICE_NAME + "-group",
  });

  await consumer.connect();
  await consumer.subscribe({
    topic: TOPICS.USER_REGISTERED,
    fromBeginning: false,
  });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const parsed = UserRegisteredEventSchema.parse(
        JSON.parse(message.value!.toString())
      );

      // business logic
      console.log( "Streaks -> Consumer parsed data on user registered event:", parsed );
    },
  });
};
