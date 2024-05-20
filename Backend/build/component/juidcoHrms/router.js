"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const receipt_route_1 = __importDefault(require("./route/receipt/receipt.route"));
const onBoardingBus_route_1 = __importDefault(require("./route/onBoardingBus/onBoardingBus.route"));
const onBoardingConductor_route_1 = __importDefault(require("./route/onBoardingConductor/onBoardingConductor.route"));
const uploadImg_route_1 = __importDefault(require("./route/uploadImage/uploadImg.route"));
const busConductorSchedule_route_1 = __importDefault(require("./route/busConductorSchedule/busConductorSchedule.route"));
const app = (0, express_1.default)();
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
class PtmsRoute {
    constructor(app) {
        new receipt_route_1.default(app);
        new onBoardingBus_route_1.default(app);
        new onBoardingConductor_route_1.default(app);
        new uploadImg_route_1.default(app);
        new busConductorSchedule_route_1.default(app);
    }
}
exports.default = PtmsRoute;
