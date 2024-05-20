"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../../../../util/common");
const onBoardingBus_services_1 = __importDefault(require("../../controller/onBoardingBus/onBoardingBus.services"));
class OnBoardingBusRoute {
    constructor(app) {
        const onBoardingBusServices = new onBoardingBus_services_1.default();
        this.init(app, onBoardingBusServices);
    }
    init(app, onBoardingBusServices) {
        app
            .route(`${common_1.baseUrl}/onBoardingBus`)
            .post((req, res) => onBoardingBusServices.onBoardingNewBus(req, res, "021G"));
    }
}
exports.default = OnBoardingBusRoute;
