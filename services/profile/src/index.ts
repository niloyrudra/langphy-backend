import Express from "express";
import "express-async-errors";
import { ProfileRouter } from "./routes/profile.js";
import { errorHandler } from "./middlewares/error-handler.js";
import pkg from "body-parser";
import { ProfileCreationRouter } from "./routes/profile-create.js";
import { ProfileUpdateRouter } from "./routes/profile-update.js";
import { dbRouter } from "./routes/db-route.js";
const {json} = pkg;
// import cors from 'cors';

const app = Express();

app.use( json() );

app.use( dbRouter );
app.use( ProfileRouter );
app.use( ProfileCreationRouter );
app.use( ProfileUpdateRouter );

app.use( errorHandler );

app.listen( 3004, () => console.log("Profile Service is running on port 3004") );