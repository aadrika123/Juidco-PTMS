"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../../../../util/common");
const busConductorSchedule_services_1 = __importDefault(require("../../controller/busConductorSchedule/busConductorSchedule.services"));
class BusConductorScheduleRoute {
    constructor(app) {
        const busConductorScheduleServices = new busConductorSchedule_services_1.default();
        this.init(app, busConductorScheduleServices);
    }
    init(app, onBoardingBusServices) {
        app
            .route(`${common_1.baseUrl}/schedule/create-new-schedule`)
            .post((req, res) => onBoardingBusServices.createScheduleBusConductor(req, res, "041P"));
        app
            .route(`${common_1.baseUrl}/schedule/get-scheduleStatus`)
            .get((req, res) => onBoardingBusServices.getScheduleBusConductorStatus(req, res, "041G"));
        app
            .route(`${common_1.baseUrl}/schedule/update-schedule`)
            .put((req, res) => onBoardingBusServices.updateScheduleBusConductor(req, res, "042P"));
    }
}
exports.default = BusConductorScheduleRoute;
