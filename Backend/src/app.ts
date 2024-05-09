import express from "express";
import dotenv from "dotenv";
import PtmsRoute from "./component/juidcoHrms/router";
import cors from "cors";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

/// JUIDCO_FINANCE ///
new PtmsRoute(app);

// app.use(loggerMiddleware);

export default app;
