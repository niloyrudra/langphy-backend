import Express from "express";
import "express-async-errors";
import { PerformanceRouter } from "./routes/performance.route.js";
import { errorHandler } from "./middlewares/error-handler.js";
import pkg from "body-parser";
import { dbRouter } from "./routes/db-route.js";
const { json } = pkg;
// import cors from 'cors';
const app = Express();
app.use(json());
app.use(dbRouter);
app.use(PerformanceRouter);
app.use(errorHandler);
app.listen(3003, () => console.log("Performance Service is running on port 3003"));
//# sourceMappingURL=index.js.map