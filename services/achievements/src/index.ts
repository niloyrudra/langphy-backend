import Express from "express";
import "express-async-errors";
import { AchievementsRouter } from "./routes/achievements.route.js";
import { errorHandler } from "./middlewares/error-handler.js";
import pkg from "body-parser";
import { dbRouter } from "./routes/db-route.js";
import { startKafka } from "./kafka/index.js";
const {json} = pkg;
// import cors from 'cors';

const app = Express();

app.use( json() );

app.use( dbRouter );
app.use( AchievementsRouter );

app.use( errorHandler );

// app.listen( 3006, () => console.log("Achievements Service is running on port 3006") );

const start = async () => {
    try {
        await startKafka();
    }
    catch(err) {
        console.error("Achievements - Kafka failed to initiate.");
    }
    app.listen( 3006, () => console.log("Achievements Service is running on port 3006") );
}
start();