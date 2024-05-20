"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResponse = void 0;
const errorCodes_1 = __importDefault(require("./errorCodes"));
/**
 * | Response Msg Version with apiMetaData
 */
const sendResponse = async (status, message, resData, responseCode, action, apiId, version, res, deviceId) => {
    if (!status) {
        resData = errorCodes_1.default[resData];
    }
    if (message && message?.code && message?.meta?.cause) {
        // message = errorCodes[message?.code as keyof typeof errorCodes];
        message = message.meta.cause;
        responseCode = 400;
    }
    else {
        message = message?.message || message;
    }
    const jsonRes = {
        status,
        message,
        "meta-data": {
            apiId,
            version,
            responseTime: res.locals.responseTime,
            action,
            deviceId,
        },
        data: resData,
    };
    res.status(responseCode).json(jsonRes);
    // res.locals.jsonRes = jsonRes;
    // res.locals.statusCode = responseCode;
    // return res;
};
exports.sendResponse = sendResponse;
