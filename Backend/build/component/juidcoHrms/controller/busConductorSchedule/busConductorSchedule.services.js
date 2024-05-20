"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commonResponse_1 = __importDefault(require("../../../../util/helper/commonResponse"));
const client_1 = require("@prisma/client");
const scheduleBusConductor_validator_1 = require("../../validators/scheduleBusConductor/scheduleBusConductor.validator");
class BusConductorScheduleServices {
    prisma = new client_1.PrismaClient();
    constructor() { }
    getScheduleBusConductorStatus = async (req, res, apiId) => {
        const resObj = {
            apiId,
            action: "GET",
            version: "1.0",
        };
        try {
            const { bus_no, conductor_id, date, from_time, to_time } = req.body;
            const setDate = new Date(date).toISOString();
            //   const setTime = time.split(":").join(",");
            const setFromTime = Number(from_time.replace(":", "").padStart(4, "0"));
            const setToTime = Number(to_time.replace(":", "").padStart(4, "0"));
            console.log(setFromTime, setToTime, "settimegetScheduleBusConductorStatus=========>");
            console.log(setDate, "setDate============");
            //validation error
            const isValidated = await scheduleBusConductor_validator_1.ScheduleBusConductorValidationSchema.validate(req.body);
            if (!Object.keys(isValidated).length) {
                return commonResponse_1.default.VALIDATION_ERROR("Validation error", resObj, res);
            }
            //checking if schedule already exist
            const isExistingSchedule = await this.prisma.busConductorMapping.findMany({
                where: {
                    bus_no,
                    conductor_id,
                    date: setDate,
                    from_time: setFromTime,
                    to_time: setToTime,
                },
            });
            console.log(isExistingSchedule, "isexistingsche=============>>");
            if (isExistingSchedule.length > 0) {
                return commonResponse_1.default.SUCCESS("Schedule already exists", isExistingSchedule, resObj, res);
            }
            return commonResponse_1.default.NOT_FOUND("Schedule not found", isExistingSchedule, resObj, res);
        }
        catch (err) {
            console.log(err, "error in getting scheduled driver to bus");
            return commonResponse_1.default.SERVER_ERROR(err, resObj, res);
        }
    };
    createScheduleBusConductor = async (req, res, apiId) => {
        const resObj = {
            apiId,
            action: "GET",
            version: "1.0",
        };
        try {
            const { bus_no, conductor_id, date, from_time, to_time } = req.body;
            //validation error
            const isValidated = await scheduleBusConductor_validator_1.ScheduleBusConductorValidationSchema.validate(req.body);
            //   const setTime = time.split(":").join(",");
            const setFromTime = Number(from_time.replace(":", "").padStart(4, "0"));
            const setToTime = Number(to_time.replace(":", "").padStart(4, "0"));
            console.log(setFromTime, setToTime, "settimegetcreateScheduleBusConductor=========>");
            const setDate = new Date(date).toISOString();
            if (!Object.keys(isValidated).length) {
                return commonResponse_1.default.VALIDATION_ERROR("Validation error", resObj, res);
            }
            //checking if schedule already exist
            const isExistingSchedule = await this.prisma.busConductorMapping.findMany({
                where: {
                    bus_no,
                    conductor_id,
                    date: setDate,
                    from_time: setFromTime,
                    to_time: setToTime,
                },
            });
            if (isExistingSchedule.length > 0) {
                return commonResponse_1.default.VALIDATION_ERROR("Schedule already exists", resObj, res);
            }
            const createNewSchedule = await this.prisma.busConductorMapping.create({
                data: {
                    bus_no,
                    conductor_id,
                    date: setDate,
                    from_time: setFromTime,
                    to_time: setToTime,
                },
            });
            return commonResponse_1.default.SUCCESS("Successfully created Scheduled!!", createNewSchedule, resObj, res);
        }
        catch (err) {
            console.log(err, "error in onboarding new bus");
            return commonResponse_1.default.SERVER_ERROR(err, resObj, res);
        }
    };
    updateScheduleBusConductor = async (req, res, apiId) => {
        const resObj = {
            apiId,
            action: "GET",
            version: "1.0",
        };
        try {
            const { bus_no, conductor_id, date, from_time, to_time } = req.body;
            //validation error
            const isValidated = await scheduleBusConductor_validator_1.ScheduleBusConductorValidationSchema.validate(req.body);
            const setDate = new Date(date).toISOString();
            const setFromTime = Number(from_time.replace(":", "").padStart(4, "0"));
            const setToTime = Number(to_time.replace(":", "").padStart(4, "0"));
            console.log(setFromTime, setToTime, "settimegetupdateScheduleBusConductor=========>");
            if (!Object.keys(isValidated).length) {
                return commonResponse_1.default.VALIDATION_ERROR("Validation error", resObj, res);
            }
            const existingSchedule = await this.prisma.busConductorMapping.findFirst({
                where: {
                    bus_no,
                    conductor_id,
                    date: setDate,
                    from_time: setFromTime,
                    to_time: setToTime,
                },
            });
            //updating already existschedule
            const updatingExistingSchedule = await this.prisma.busConductorMapping.update({
                where: { id: existingSchedule?.id },
                data: {
                    bus_no,
                    conductor_id,
                    date: setDate,
                    from_time: setFromTime,
                    to_time: setToTime,
                },
            });
            return commonResponse_1.default.SUCCESS("Successfully created Scheduled!!", updatingExistingSchedule, resObj, res);
        }
        catch (err) {
            console.log(err, "error in updating already created schedule");
            return commonResponse_1.default.SERVER_ERROR(err, resObj, res);
        }
    };
}
exports.default = BusConductorScheduleServices;
