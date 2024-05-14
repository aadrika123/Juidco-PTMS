import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { resObj } from "../../../../util/types";
import multer from "multer";
import { OnBoardingBusDataValidationSchema } from "../../validators/onBoardingBus/onBoardingBus.validator";
import { Prisma } from "@prisma/client";
import CommonRes from "../../../../util/helper/commonResponse";
import { OnBoardingConductorDataValidationSchema } from "../../validators/onBoardingConductor/onBoardingConductor.validator";

type TOnBoardingConductorData = {
  firstName: string;
  middleName: string;
  lastName: string;
  age: string;
  bloodGrp: string;
  mobileNo: string;
  emailId: string;
  emergencyMobNo: string;
  adhar_doc: {};
};

export default class OnBoardingConductorServices {
  private initMsg: string;
  public prisma = new PrismaClient();
  constructor() {
    this.initMsg = "Conductor";
  }

  onBoardingNewConductor = async (
    req: Request,
    res: Response,
    apiId: string
  ) => {
    console.log("clicked111===============>>");
    const resObj: resObj = {
      apiId,
      action: "GET",
      version: "1.0",
    };

    try {
      console.log("clicked===============>>");
      const {
        firstName,
        middleName,
        lastName,
        age,
        bloodGrp,
        mobileNo,
        emailId,
        emergencyMobNo,
        adhar_doc,
      } = req.body;

      let newConductorData: TOnBoardingConductorData = {
        firstName: "",
        middleName: "",
        lastName: "",
        age: "",
        bloodGrp: "",
        mobileNo: "",
        emailId: "",
        emergencyMobNo: "",
        adhar_doc: {},
      };

      //checking if bus already exist
      // const isExistingConductor =
      // await this.prisma.onBoardedBusDetails.findUnique({
      //   where: { emailId: emailId },
      // });

      // if (isExistingConductor) {
      //   return CommonRes.VALIDATION_ERROR(
      //     "Already registered Conductor",
      //     resObj,
      //     res
      //   );
      // }

      //validation of request body with files and json
      const isValidated =
        await OnBoardingConductorDataValidationSchema.validate(req.body);

      if (!Object.keys(isValidated).length) {
        return CommonRes.VALIDATION_ERROR("Validation error", resObj, res);
      }

      if (!Object.keys(adhar_doc).length) {
        return CommonRes.VALIDATION_ERROR("adhar_doc is required", resObj, res);
      }

      // const newOnboardedBus = await this.prisma.onBoardedBusDetails.create({
      //   data: {
      //     firstName,
      //     middleName,
      //     lastName,
      //     age,
      //     bloodGrp,
      //     mobileNo,
      //     emailId,
      //     emergencyMobNo,
      //     adhar_doc,
      //   },
      // });

      // return CommonRes.SUCCESS(
      //   "Successfully added the bus",
      //   newOnboardedBus,
      //   resObj,
      //   res
      // );

      // const existingBus = await this.prisma.onBoardingBusDetails.findUnique({ where: {vin_no}})
    } catch (err) {
      console.log(err, "error in onboarding new bus");
      return CommonRes.SERVER_ERROR(err, resObj, res);
    }
  };
}
