"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../../../../util/common");
const onBoardingConductor_services_1 = __importDefault(require("../../controller/onBoardingConductor/onBoardingConductor.services"));
class OnBoardingConductorRoute {
    constructor(app) {
        const onBoardingConductorServices = new onBoardingConductor_services_1.default();
        this.init(app, onBoardingConductorServices);
    }
    init(app, onBoardingConductorServices) {
        app
            .route(`${common_1.baseUrl}/onBoardingConductor`)
            .post((req, res) => onBoardingConductorServices.onBoardingNewConductor(req, res, "021G"));
    }
}
exports.default = OnBoardingConductorRoute;
