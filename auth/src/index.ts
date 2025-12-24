import express from "express";
import "express-async-errors";
import pkg from 'body-parser';
// import dotenv from 'dotenv';
import { currentUserRouter } from "./routes/current-user.js";
import { signInRouter } from "./routes/signin.js";
import { signOutRouter } from "./routes/signout.js";
import { signUpRouter } from "./routes/signup.js";
const { json } = pkg;
import { errorHandler } from "./middlewares/error-hander.js";
import { NotFoundError } from "./errors/no-find-errors.js";
import { dbRouter } from "./routes/db-route.js";
import { profileUpdateRouter } from "./routes/profile-update.js";

// dotenv.config();

const app = express();

app.use( json() );

app.use( dbRouter );
app.use( currentUserRouter );
app.use( signInRouter );
app.use( signOutRouter );
app.use( signUpRouter );
app.use( profileUpdateRouter );

// app.get('/api/users/db', async (_req, res) => {
//   const result = await pgPool.query('SELECT 1');
//   res.send({ db: 'ok', result: result.rows });
// });

// Sync way
// app.all( "*", () => { throw new NotFoundError() });

// Async way
// app.all( "*", ( req, res, next ) => next( new NotFoundError() ) );
app.all( "*", async ( req, res ) => { throw new NotFoundError() } );

app.use( errorHandler );

const PORT = process.env.PORT || 3000;

app.listen(
    PORT,
    () => {
        console.log(`Auth Service listening to port ${PORT}`);
    }
);