"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const router_1 = __importDefault(require("./component/juidcoHrms/router"));
const cors_1 = __importDefault(require("cors"));
// import { client } from "./db";
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json({ limit: "50mb" }));
app.use((0, cors_1.default)());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded());
// in latest body-parser use like below.
app.use(express_1.default.urlencoded({ extended: true }));
//connecting db
// client.connect((err: any) => {
//   if (err) {
//     console.log("connection error", err);
//   } else {
//     console.log("connected to db");
//   }
// });
/// JUIDCO_PTMS ///
new router_1.default(app);
exports.default = app;
