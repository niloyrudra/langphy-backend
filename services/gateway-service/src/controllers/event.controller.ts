import type { Request, Response } from "express";
import { BaseEventSchema } from "@langphy/shared";
// import { mapEventToTopic } from "../routes/event.route.js";
import { publishEvent } from "../kafka/producer.js";
import { EventInboxModel } from "../models/event.model.js";

export const postEvent = async (req: Request, res: Response) => {
    try {

        // 1️⃣ Validate shape
        const event = BaseEventSchema.parse(req.body);
    
        // 2️⃣ Idempotency (HTTP-level)
        const alreadyHandled = await EventInboxModel.hasProcessed(event.event_id);
        if ( alreadyHandled ) return res.sendStatus(200);
    
        // 3️⃣ Persist inbox - Store inbox FIRST (critical)
        await EventInboxModel.markProcessed(event);
    
        // 4️⃣ Produce to Kafka
        await publishEvent(event);
    
    //   await producer.send({
    //     topic: mapEventToTopic(event.event_type),
    //     messages: [
    //       {
    //         key: event.user_id,
    //         value: JSON.stringify(event),
    //       },
    //     ],
    //   });
    
        return res.sendStatus(200);
    }
    catch(error) {
        console.error( "POST /api/events failed", error );
        return res.status(400).json({error: "Invalid event"});
    }
};