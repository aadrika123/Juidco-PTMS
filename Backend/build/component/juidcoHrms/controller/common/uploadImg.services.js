"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadImgServices = void 0;
const commonResponse_1 = __importDefault(require("../../../../util/helper/commonResponse"));
const common_1 = require("../../../../util/common");
class UploadImgServices {
    // public prisma = new PrismaClient();
    constructor() { }
    imageUpload = async (req, res, next, apiId) => {
        const imageData = req.file;
        const resObj = {
            apiId,
            action: "GET",
            version: "1.0",
        };
        console.log(req.file, "file============>img folder");
        let data = {
            name: imageData?.originalname,
            mimeType: imageData?.mimetype,
            buffer: imageData?.buffer,
            size: String(imageData?.size),
        };
        console.log(data, "data =====>>");
        return commonResponse_1.default.SUCCESS((0, common_1.resMessage)("Image uploaded successfully").FOUND, data, resObj, res, next);
    };
}
exports.UploadImgServices = UploadImgServices;
