import Express from "express";
import "express-async-errors";
import { ProgressRouter } from "./routes/progress.route.js";
import { errorHandler } from "./middlewares/error-handler.js";
import pkg from "body-parser";
import { dbRouter } from "./routes/db-route.js";
const { json } = pkg;
// import cors from 'cors';
const app = Express();
app.use(json());
app.use(dbRouter);
app.use(ProgressRouter);
app.use(errorHandler);
app.listen(3002, () => console.log("Progress Service is running on port 3002"));
//# sourceMappingURL=index.js.map