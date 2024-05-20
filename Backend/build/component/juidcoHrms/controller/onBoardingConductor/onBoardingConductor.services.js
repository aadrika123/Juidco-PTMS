"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const commonResponse_1 = __importDefault(require("../../../../util/helper/commonResponse"));
const onBoardingConductor_validator_1 = require("../../validators/onBoardingConductor/onBoardingConductor.validator");
const generateUniqueNo_1 = __importDefault(require("../../../../util/helper/generateUniqueNo"));
class OnBoardingConductorServices {
    initMsg;
    prisma = new client_1.PrismaClient();
    constructor() {
        this.initMsg = "Conductor";
    }
    onBoardingNewConductor = async (req, res, apiId) => {
        const resObj = {
            apiId,
            action: "GET",
            version: "1.0",
        };
        try {
            const { firstName, middleName, lastName, age, bloodGrp, mobileNo, emailId, emergencyMobNo, adhar_doc, adhar_no, fitness_doc, } = req.body;
            //validation of request body with files and json
            const isValidated = await onBoardingConductor_validator_1.OnBoardingConductorDataValidationSchema.validate(req.body);
            if (!Object.keys(isValidated).length) {
                return commonResponse_1.default.VALIDATION_ERROR("Validation error", resObj, res);
            }
            if (!Object.keys(fitness_doc).length) {
                return commonResponse_1.default.VALIDATION_ERROR("fitness_doc is required", resObj, res);
            }
            if (!Object.keys(adhar_doc).length) {
                return commonResponse_1.default.VALIDATION_ERROR("adhar_doc is required", resObj, res);
            }
            //checking if conductor already exist
            const isExistingConductor = await this.prisma.onBoardedConductorDetails.findUnique({
                where: { adhar_no },
            });
            if (isExistingConductor) {
                return commonResponse_1.default.VALIDATION_ERROR("Already registered Conductor", resObj, res);
            }
            const newOnboardedConductor = await this.prisma.onBoardedConductorDetails.create({
                data: {
                    firstName: firstName,
                    middleName,
                    lastName,
                    age,
                    bloodGrp,
                    mobileNo,
                    emailId,
                    emergencyMobNo,
                    adhar_doc,
                    adhar_no,
                    fitness_doc,
                    cUniqueId: "",
                },
            });
            // const uniqueId = generateUnique();
            const cUniqueId = (0, generateUniqueNo_1.default)(newOnboardedConductor?.id);
            console.log(cUniqueId, "uniqueId=================>");
            const updatingConductorDetails = await this.prisma.onBoardedConductorDetails.update({
                where: {
                    emailId: newOnboardedConductor.emailId,
                },
                data: {
                    cUniqueId,
                },
            });
            const onBoardedConductorWithUniqueId = {
                ...newOnboardedConductor,
                cUniqueId,
            };
            return commonResponse_1.default.SUCCESS("Successfully registered the conductor", onBoardedConductorWithUniqueId, resObj, res);
        }
        catch (err) {
            console.log(err, "error in onboarding new bus");
            return commonResponse_1.default.SERVER_ERROR(err, resObj, res);
        }
    };
    getAllConductorList = async (req, res, apiId) => {
        const resObj = {
            apiId,
            action: "GET",
            version: "1.0",
        };
        try {
            const getAllConductorData = await this.prisma.onBoardedConductorDetails.findMany();
            if (!getAllConductorData.length)
                return commonResponse_1.default.NOT_FOUND("Data not found", getAllConductorData, resObj, res);
            return commonResponse_1.default.SUCCESS("Successfully fetched all bus details", getAllConductorData, resObj, res);
        }
        catch (err) {
            console.log(err, "error in fetching bus list");
            return commonResponse_1.default.SERVER_ERROR(err, resObj, res);
        }
    };
}
exports.default = OnBoardingConductorServices;
