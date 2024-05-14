import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { resObj } from "../../../../util/types";
import multer from "multer";
import { OnBoardingBusDataValidationSchema } from "../../validators/onBoardingBus/onBoardingBus.validator";
import { Prisma } from "@prisma/client";
import CommonRes from "../../../../util/helper/commonResponse";
import { OnBoardingConductorDataValidationSchema } from "../../validators/onBoardingConductor/onBoardingConductor.validator";
import generateUniqueId, {
  generateUnique,
} from "../../../../util/helper/generateUniqueNo";

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
    const resObj: resObj = {
      apiId,
      action: "GET",
      version: "1.0",
    };

    try {
      const {
        firstName,
        middleName,
        lastName,
        age,
        bloodGrp,
        mobileNo,
        emailId,
        emergencyMobNo,
        // adhar_doc,
        fitness_doc,
      } = req.body;

      //checking if conductor already exist
      const isExistingConductor =
        await this.prisma.onBoardedConductorDetails.findUnique({
          where: { emailId: emailId },
        });

      if (isExistingConductor) {
        return CommonRes.VALIDATION_ERROR(
          "Already registered Conductor",
          resObj,
          res
        );
      }

      //validation of request body with files and json
      const isValidated =
        await OnBoardingConductorDataValidationSchema.validate(req.body);

      if (!Object.keys(isValidated).length) {
        return CommonRes.VALIDATION_ERROR("Validation error", resObj, res);
      }

      // if (!Object.keys(adhar_doc).length) {
      //   return CommonRes.VALIDATION_ERROR("adhar_doc is required", resObj, res);
      // }

      if (!Object.keys(fitness_doc).length) {
        return CommonRes.VALIDATION_ERROR(
          "fitness_doc is required",
          resObj,
          res
        );
      }

      const newOnboardedConductor =
        await this.prisma.onBoardedConductorDetails.create({
          data: {
            firstName: firstName,
            middleName,
            lastName,
            age,
            bloodGrp,
            mobileNo,
            emailId,
            emergencyMobNo,
            // adhar_doc,
            fitness_doc,
            cUniqueId: "",
          },
        });

      // const uniqueId = generateUnique();
      const cUniqueId = generateUniqueId(newOnboardedConductor?.id);
      console.log(cUniqueId, "uniqueId=================>");

      const updatingConductorDetails =
        await this.prisma.onBoardedConductorDetails.update({
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

      return CommonRes.SUCCESS(
        "Successfully registered the conductor",
        onBoardedConductorWithUniqueId,
        resObj,
        res
      );
    } catch (err) {
      console.log(err, "error in onboarding new bus");
      return CommonRes.SERVER_ERROR(err, resObj, res);
    }
  };
}
