import express from "express";
import ReceiptRoute from "./route/receipt/receipt.route";
import { Router } from "express";
import { baseUrl } from "../../util/common";
import OnBoardingBusRoute from "./route/onBoardingBus/onBoardingBus.route";
import OnBoardingConductorRoute from "./route/onBoardingConductor/onBoardingConductor.route";
import UploadImgRoute from "./route/uploadImage/uploadImg.route";
import BusConductorScheduleRoute from "./route/busConductorSchedule/busConductorSchedule.route";
import ConductorReportRoute from "./route/conductorReport/conductorReport.route";
import BusGenerateReportServices from "./controller/reportGeneration/busReport.services";
import BusReportRoute from "./route/busReport/busReport.route";

const app = express();

/*
|--------------------------------------------------------------------------
| API Routes
| Author- Krish
| Created On- 14-02-2024 
| Created for- juidco_hrms
| Module status- Open
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application.
|
*/
/**
 * | Comman Route for finance
 */

export default class PtmsRoute {
  constructor(app: express.Application) {
    new ReceiptRoute(app);
    new OnBoardingBusRoute(app);
    new OnBoardingConductorRoute(app);
    new UploadImgRoute(app);
    new BusConductorScheduleRoute(app);
    new ConductorReportRoute(app);
    new BusReportRoute(app);
  }
}
