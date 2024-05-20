"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.receiptValidationSchema = exports.receiptValidatorData = void 0;
const Yup = __importStar(require("yup"));
const receiptValidatorData = (receipt) => {
    return {
        receipt_no: receipt.receipt_no,
        amount: receipt.amount,
        date: receipt.date,
        conductor_id: receipt.conductor_id,
        rc: receipt.rc,
        time: receipt.time,
        conductor: receipt.conductor,
    };
};
exports.receiptValidatorData = receiptValidatorData;
exports.receiptValidationSchema = Yup.object({
    receipt_no: Yup.string().required(),
    amount: Yup.number().required(),
    date: Yup.date().required(),
    conductor_id: Yup.string().required(),
    rc_no: Yup.string().required(),
    time: Yup.string().required(),
});
