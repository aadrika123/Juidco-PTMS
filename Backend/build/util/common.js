"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resMessage = exports.baseUrl = void 0;
exports.baseUrl = `/api/ptms/v1`;
// Common response message
/**
 * Author: Krish
 * Working: OK
 * Status: Open
 */
function resMessage(value) {
    const NOT_FOUND = `${value} Not Found`;
    const FOUND = `${value} Found Successfully!!`;
    const CREATED = `${value} created Successfully!!`;
    const UPDATED = `${value} updated Successfully!!`;
    return { FOUND, NOT_FOUND, CREATED, UPDATED };
}
exports.resMessage = resMessage;
