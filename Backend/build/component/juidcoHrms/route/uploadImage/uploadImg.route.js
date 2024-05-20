"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const common_1 = require("../../../../util/common");
const multer_1 = __importDefault(require("multer"));
const uploadImg_services_1 = require("../../controller/common/uploadImg.services");
const storage = multer_1.default.memoryStorage();
exports.upload = (0, multer_1.default)({ storage: storage });
class UploadImgRoute {
    constructor(app) {
        const uploadImgServices = new uploadImg_services_1.UploadImgServices();
        this.init(app, uploadImgServices);
    }
    init(app, uploadImgServices) {
        app
            .route(`${common_1.baseUrl}/common/img-upload`)
            .post(exports.upload.single("img"), (req, res, next) => uploadImgServices.imageUpload(req, res, next, "69.0"));
    }
}
exports.default = UploadImgRoute;
