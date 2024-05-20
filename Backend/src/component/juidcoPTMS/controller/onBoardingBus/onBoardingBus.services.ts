import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { resObj } from "../../../../util/types";
import CommonRes from "../../../../util/helper/commonResponse";
import BusOnboarding from "../../dao/onBoardBus/onboardBus.dao";

export default class OnBoardingBusServices {
  private initMsg: string;
  public prisma = new PrismaClient();

  private busOnboarding: BusOnboarding;
  constructor() {
    this.initMsg = "On Boarding of bus";
    this.busOnboarding = new BusOnboarding();
  }

  onBoardingNewBus = async (req: Request, res: Response, apiId: string) => {
    const resObj: resObj = {
      apiId,
      action: "GET",
      version: "1.0",
    };
    const {
      registration_no,
      vin_no,
      taxCopy_cert,
      registration_cert,
      pollution_cert,
    } = req.body;

    try {
      // ---------------------------- VALIDATION --------------------------------------------//
      //validation of request body with files and json
      if (!registration_no) {
        return CommonRes.VALIDATION_ERROR(
          "Registration Number is required",
          resObj,
          res
        );
      }

      if (!vin_no || vin_no == "") {
        return CommonRes.VALIDATION_ERROR(
          "VIN Number is required",
          resObj,
          res
        );
      }

      if (!Object.keys(taxCopy_cert).length) {
        return CommonRes.VALIDATION_ERROR(
          "TaxCopy document is required",
          resObj,
          res
        );
      }

      if (!Object.keys(registration_cert).length) {
        return CommonRes.VALIDATION_ERROR(
          "Registration certificate document is required",
          resObj,
          res
        );
      }

      if (!Object.keys(pollution_cert).length) {
        return CommonRes.VALIDATION_ERROR(
          "Pollution certificate document is required",
          resObj,
          res
        );
      }
      // ---------------------------- VALIDATION --------------------------------------------//

      const data = await this.busOnboarding.onBoardingNewBus(req);

      if (data.error_type === "VALIDATION") {
        return CommonRes.VALIDATION_ERROR(
          "Vehicle Already Registered",
          resObj,
          res
        );
      }

      return CommonRes.SUCCESS("Successfully added the bus", data, resObj, res);
    } catch (err) {
      console.log(err, "error in onboarding new bus");
      return CommonRes.SERVER_ERROR(err, resObj, res);
    }
  };

  getAllBusList = async (req: Request, res: Response, apiId: string) => {
    const resObj: resObj = {
      apiId,
      action: "GET",
      version: "1.0",
    };

    try {
      const data = await this.busOnboarding.getAllBusList(req);

      if (!data) {
        return CommonRes.NOT_FOUND("Vehicle Not Found", data, resObj, res);
      }

      return CommonRes.SUCCESS("Successfully added the bus", data, resObj, res);
    } catch (err) {
      return CommonRes.SERVER_ERROR(err, resObj, res);
    }
  };

  updateBusDetails = async (req: Request, res: Response, apiId: string) => {
    const resObj: resObj = {
      apiId,
      action: "GET",
      version: "1.0",
    };

    try {
      const data = await this.busOnboarding.updateBusDetails(req);

      if (!data) {
        return CommonRes.NOT_FOUND("Vehicle Not Found", data, resObj, res);
      }

      return CommonRes.SUCCESS(
        "Successfully updated the bus",
        data,
        resObj,
        res
      );
    } catch (err) {
      return CommonRes.SERVER_ERROR(err, resObj, res);
    }
  };

  deleteBus = async (req: Request, res: Response, apiId: string) => {
    const resObj: resObj = {
      apiId,
      action: "GET",
      version: "1.0",
    };

    try {
      const data = await this.busOnboarding.deleteBus(req);

      if (!data) {
        return CommonRes.NOT_FOUND("Vehicle Not Found", data, resObj, res);
      }

      return CommonRes.SUCCESS(
        "Successfully deleted the bus",
        data,
        resObj,
        res
      );
    } catch (err) {
      return CommonRes.SERVER_ERROR(err, resObj, res);
    }
  };
}
