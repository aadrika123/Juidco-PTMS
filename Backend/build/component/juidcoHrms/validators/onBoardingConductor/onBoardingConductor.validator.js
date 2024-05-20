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
exports.OnBoardingConductorDataValidationSchema = void 0;
const Yup = __importStar(require("yup"));
const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
exports.OnBoardingConductorDataValidationSchema = Yup.object({
    firstName: Yup.string().required(),
    middleName: Yup.string().required(),
    lastName: Yup.string().required(),
    age: Yup.string().required(),
    bloodGrp: Yup.string().required(),
    mobileNo: Yup.string()
        .required("required")
        .matches(phoneRegExp, "Phone number is not valid")
        .min(10, "mobile number must be 10 digit")
        .max(10, "mobile number must be 10 digit"),
    emailId: Yup.string().email("Please enter a valid email address"),
    emergencyMobNo: Yup.string()
        .required("required")
        .matches(phoneRegExp, "Phone number is not valid")
        .min(10, "mobile number must be 10 digit")
        .max(10, "mobile number must be 10 digit"),
    adhar_no: Yup.string()
        .required("required")
        .min(12, "adhar no must be 12 digits")
        .max(12, "adhar no must be 12 digits"),
});
