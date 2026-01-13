// import { TOPICS } from "./topics.js";

// export const publishEvent = async (
//   producer: any,
//   event: { user_id: string }
// ) => {
//   await producer.send({
//     topic: TOPICS.USERS_EVENTS,
//     messages: [
//       {
//         key: event.user_id,
//         value: JSON.stringify( event )
//       },
//     ],
//   });
// };