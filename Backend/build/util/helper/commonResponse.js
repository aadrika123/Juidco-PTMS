"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendResponse_1 = require("../sendResponse");
const CommonRes = Object.freeze({
    VALIDATION_ERROR: (error, resObj, res) => {
        return (0, sendResponse_1.sendResponse)(false, error, "", 404, resObj.action, resObj.apiId, resObj.version, res);
    },
    SERVER_ERROR: (error, resObj, res) => {
        return (0, sendResponse_1.sendResponse)(false, error, "", 400, resObj.action, resObj.apiId, resObj.version, res);
    },
    CREATED: (message, data, resObj, res) => {
        return (0, sendResponse_1.sendResponse)(true, message, data, 200, resObj.action, resObj.apiId, resObj.version, res);
    },
    SUCCESS: (message, data, resObj, res, next) => {
        return (0, sendResponse_1.sendResponse)(true, message, data, 200, resObj.action, resObj.apiId, resObj.version, res);
    },
    NOT_FOUND: (message, data, resObj, res) => {
        return (0, sendResponse_1.sendResponse)(true, message, data, 400, resObj.action, resObj.apiId, resObj.version, res);
    },
    UNAUTHORISED: (error, resObj, res) => {
        return (0, sendResponse_1.sendResponse)(false, error, "", 404, resObj.action, resObj.apiId, resObj.version, res);
    },
    DEFAULT: "The underlying {kind} for model {model} does not exist.",
});
exports.default = CommonRes;
