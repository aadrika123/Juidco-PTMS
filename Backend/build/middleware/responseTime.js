"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseTime = void 0;
const responseTime = (req, res, next) => {
    console.log("responsetime called===>");
    const startTime = Date.now();
    res.on("finish", () => {
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        res.locals.responseTime = responseTime;
    });
    next();
};
exports.responseTime = responseTime;
