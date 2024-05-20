"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const receipt_services_1 = __importDefault(require("../../controller/receipt/receipt.services"));
const common_1 = require("../../../../util/common");
const responseTime_1 = require("../../../../middleware/responseTime");
class ReceiptRoute {
    constructor(app) {
        const receiptServices = new receipt_services_1.default();
        this.init(app, receiptServices);
    }
    init(app, receiptServices) {
        app
            .route(`${common_1.baseUrl}/receipt/cnreate`)
            .post((req, res) => receiptServices.post(req, res, "0101"));
        app
            .route(`${common_1.baseUrl}/receipt/get`)
            .get(responseTime_1.responseTime, (req, res) => receiptServices.get(req, res, "0102"));
    }
}
exports.default = ReceiptRoute;
