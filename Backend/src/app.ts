import express from "express";
import dotenv from "dotenv";
import PtmsRoute from "./component/juidcoHrms/router";
import cors from "cors";
import bodyParser from "body-parser";
// import { client } from "./db";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
// in latest body-parser use like below.
app.use(express.urlencoded({ extended: true }));

//connecting db
// client.connect((err: any) => {
//   if (err) {
//     console.log("connection error", err);
//   } else {
//     console.log("connected to db");
//   }
// });

/// JUIDCO_PTMS ///
new PtmsRoute(app);

export default app;
