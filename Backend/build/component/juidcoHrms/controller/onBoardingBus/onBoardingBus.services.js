"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const commonResponse_1 = __importDefault(require("../../../../util/helper/commonResponse"));
class OnBoardingBusServices {
    initMsg;
    prisma = new client_1.PrismaClient();
    constructor() {
        this.initMsg = "On Boarding of bus";
    }
    onBoardingNewBus = async (req, res, apiId) => {
        const resObj = {
            apiId,
            action: "GET",
            version: "1.0",
        };
        try {
            const { registration_no, vin_no, taxCopy_cert, registration_cert, pollution_cert, } = req.body;
            console.log(registration_no, "registration_no==>>");
            let newBusData = {
                registration_no: "",
                vin_no: "",
                taxCopy_cert: {},
                registration_cert: {},
                pollution_cert: {},
            };
            //validation of request body with files and json
            if (!registration_no) {
                return commonResponse_1.default.VALIDATION_ERROR("Registration Number is required", resObj, res);
            }
            else {
                newBusData = { ...newBusData, registration_no };
            }
            if (!vin_no || vin_no == "") {
                return commonResponse_1.default.VALIDATION_ERROR("VIN Number is required", resObj, res);
            }
            else {
                newBusData = { ...newBusData, vin_no };
            }
            if (!Object.keys(taxCopy_cert).length) {
                return commonResponse_1.default.VALIDATION_ERROR("TaxCopy document is required", resObj, res);
            }
            else {
                newBusData = { ...newBusData, taxCopy_cert };
            }
            if (!Object.keys(registration_cert).length) {
                return commonResponse_1.default.VALIDATION_ERROR("Registration certificate document is required", resObj, res);
            }
            else {
                newBusData = { ...newBusData, registration_cert };
            }
            if (!Object.keys(pollution_cert).length) {
                return commonResponse_1.default.VALIDATION_ERROR("Pollution certificate document is required", resObj, res);
            }
            else {
                newBusData = { ...newBusData, pollution_cert };
            }
            // if (fileData && Array.isArray(fileData)) {
            //   const taxCopy_cert = fileData.find(
            //     (data: any) => data.fieldname === "taxCopy_cert"
            //   );
            // }
            //checking if bus already exist
            const isExistingBus = await this.prisma.onBoardedBusDetails.findUnique({
                where: { vin_no: vin_no },
            });
            if (isExistingBus) {
                return commonResponse_1.default.VALIDATION_ERROR("Already registered vehicle", resObj, res);
            }
            const newOnboardedBus = await this.prisma.onBoardedBusDetails.create({
                data: {
                    pollution_doc: newBusData?.pollution_cert,
                    registrationCert_doc: newBusData?.registration_cert,
                    register_no: newBusData?.registration_no,
                    taxCopy_doc: newBusData?.taxCopy_cert,
                    vin_no: newBusData?.vin_no,
                },
            });
            return commonResponse_1.default.SUCCESS("Successfully added the bus", newOnboardedBus, resObj, res);
        }
        catch (err) {
            console.log(err, "error in onboarding new bus");
            return commonResponse_1.default.SERVER_ERROR(err, resObj, res);
        }
    };
    getAllBusList = async (req, res, apiId) => {
        const resObj = {
            apiId,
            action: "GET",
            version: "1.0",
        };
        try {
            const getAllBusData = await this.prisma.onBoardedBusDetails.findMany();
            if (!getAllBusData.length)
                return commonResponse_1.default.NOT_FOUND("Data not found", getAllBusData, resObj, res);
            return commonResponse_1.default.SUCCESS("Successfully fetched all bus details", getAllBusData, resObj, res);
        }
        catch (err) {
            console.log(err, "error in fetching bus list");
            return commonResponse_1.default.SERVER_ERROR(err, resObj, res);
        }
    };
}
exports.default = OnBoardingBusServices;
