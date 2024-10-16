import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { resObj } from "../../../../util/types";
import CommonRes from "../../../../util/helper/commonResponse";
import { OnBoardingConductorDataValidationSchema } from "../../validators/onBoardingConductor/onBoardingConductor.validator";
import ConductorOnBoarding from "../../dao/onBoardConductor/onboardConductor.dao";

export default class OnBoardingConductorServices {
  private initMsg: string;
  public prisma = new PrismaClient();
  private constructorOnboarding: ConductorOnBoarding;
  constructor() {
    this.initMsg = "Conductor";
    this.constructorOnboarding = new ConductorOnBoarding();
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
      const { adhar_doc, fitness_doc } = req.body;

      // ---------------------------- VALIDATION --------------------------------------------//
      //validation of request body with files and json
      const isValidated =
        await OnBoardingConductorDataValidationSchema.validate(req.body);

      if (!Object.keys(isValidated).length) {
        return CommonRes.VALIDATION_ERROR("Validation error", resObj, res);
      }

      if (!Object.keys(fitness_doc).length) {
        return CommonRes.VALIDATION_ERROR(
          "fitness_doc is required",
          resObj,
          res
        );
      }

      if (!Object.keys(adhar_doc).length) {
        return CommonRes.VALIDATION_ERROR("adhar_doc is required", resObj, res);
      }

      const data = await this.constructorOnboarding.onBoardingNewConductor(req);

      if (data.error_type === "VALIDATION") {
        return CommonRes.VALIDATION_ERROR(
          "Conductor Already Registered",
          resObj,
          res
        );
      }

      // ---------------------------- VALIDATION --------------------------------------------//
      return CommonRes.SUCCESS(
        "Successfully registered the conductor",
        data,
        resObj,
        res
      );
    } catch (err) {
      return CommonRes.SERVER_ERROR(err, resObj, res);
    }
  };

  getAllConductorList = async (req: Request, res: Response, apiId: string) => {
    const resObj: resObj = {
      apiId,
      action: "GET",
      version: "1.0",
    };

    try {
      const data = await this.constructorOnboarding.getAllConductorList(req);

      if (!data) {
        return CommonRes.NOT_FOUND("Conductor Not Found", data, resObj, res);
      }

      return CommonRes.SUCCESS(
        "Conductors Found Successfully!",
        data,
        resObj,
        res
      );
    } catch (err) {
      console.log(err)
      return CommonRes.SERVER_ERROR(err, resObj, res);
    }
  };

  getConductorStatus = async (req: Request, res: Response, apiId: string) => {
    const resObj: resObj = {
      apiId,
      action: "GET",
      version: "1.0",
    };

    try {
      const data = await this.constructorOnboarding.getConductorStatus(req);

      if (!data) {
        return CommonRes.NOT_FOUND("Conductor Not Found", data, resObj, res);
      }

      return CommonRes.SUCCESS(
        "Conductors Found Successfully!",
        data,
        resObj,
        res
      );
    } catch (err) {
      return CommonRes.SERVER_ERROR(err, resObj, res);
    }
  };

  validate_aadhar = async (req: Request, res: Response, apiId: string) => {
    const resObj: resObj = {
      apiId,
      action: "GET",
      version: "1.0",
    };

    try {
      const data = await this.constructorOnboarding.validate_aadhar(req);

      if (!data) {
        return CommonRes.NOT_FOUND("Aadhar Not Found", data, resObj, res);
      }

      return CommonRes.SUCCESS("Aadhar Found Successfully!", data, resObj, res);
    } catch (err) {
      return CommonRes.SERVER_ERROR(err, resObj, res);
    }
  };

  getConductorImage = async (req: Request, res: Response, apiId: string) => {
    const resObj: resObj = {
      apiId,
      action: "GET",
      version: "1.0",
    };

    try {
      const data = await this.constructorOnboarding.getConductorImage(req);

      if (!data) {
        return CommonRes.NOT_FOUND("Data Not Found", data, resObj, res);
      }

      return CommonRes.SUCCESS(
        "Successfully fetched",
        data,
        resObj,
        res
      );
    } catch (err) {
      return CommonRes.SERVER_ERROR(err, resObj, res);
    }
  };

}
