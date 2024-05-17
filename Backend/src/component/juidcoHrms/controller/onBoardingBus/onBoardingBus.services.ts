import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { resObj } from "../../../../util/types";
import { OnBoardingBusDataValidationSchema } from "../../validators/onBoardingBus/onBoardingBus.validator";
import CommonRes from "../../../../util/helper/commonResponse";
import { excludeFields } from "../../../../util/helper/excludeFieldsfromdbData";

type TOnBoardingBusData = {
  registration_no: string;
  vin_no: string;
  taxCopy_cert: {};
  registration_cert: {};
  pollution_cert: {};
};

export default class OnBoardingBusServices {
  private initMsg: string;
  public prisma = new PrismaClient();
  constructor() {
    this.initMsg = "On Boarding of bus";
  }

  onBoardingNewBus = async (req: Request, res: Response, apiId: string) => {
    const resObj: resObj = {
      apiId,
      action: "GET",
      version: "1.0",
    };

    try {
      const {
        registration_no,
        vin_no,
        taxCopy_cert,
        registration_cert,
        pollution_cert,
      } = req.body;

      console.log(registration_no, "registration_no==>>");

      let newBusData: TOnBoardingBusData = {
        registration_no: "",
        vin_no: "",
        taxCopy_cert: {},
        registration_cert: {},
        pollution_cert: {},
      };

      //validation of request body with files and json
      if (!registration_no) {
        return CommonRes.VALIDATION_ERROR(
          "Registration Number is required",
          resObj,
          res
        );
      } else {
        newBusData = { ...newBusData, registration_no };
      }

      if (!vin_no || vin_no == "") {
        return CommonRes.VALIDATION_ERROR(
          "VIN Number is required",
          resObj,
          res
        );
      } else {
        newBusData = { ...newBusData, vin_no };
      }

      if (!Object.keys(taxCopy_cert).length) {
        return CommonRes.VALIDATION_ERROR(
          "TaxCopy document is required",
          resObj,
          res
        );
      } else {
        newBusData = { ...newBusData, taxCopy_cert };
      }

      if (!Object.keys(registration_cert).length) {
        return CommonRes.VALIDATION_ERROR(
          "Registration certificate document is required",
          resObj,
          res
        );
      } else {
        newBusData = { ...newBusData, registration_cert };
      }

      if (!Object.keys(pollution_cert).length) {
        return CommonRes.VALIDATION_ERROR(
          "Pollution certificate document is required",
          resObj,
          res
        );
      } else {
        newBusData = { ...newBusData, pollution_cert };
      }

      // if (fileData && Array.isArray(fileData)) {
      //   const taxCopy_cert = fileData.find(
      //     (data: any) => data.fieldname === "taxCopy_cert"
      //   );
      // }

      //checking if bus already exist
      const isExistingBus = await this.prisma.bus_master.findUnique({
        where: { vin_no: vin_no },
      });

      if (isExistingBus) {
        return CommonRes.VALIDATION_ERROR(
          "Already registered vehicle",
          resObj,
          res
        );
      }

      const newOnboardedBus = await this.prisma.bus_master.create({
        data: {
          pollution_doc: newBusData?.pollution_cert,
          registrationCert_doc: newBusData?.registration_cert,
          register_no: newBusData?.registration_no,
          taxCopy_doc: newBusData?.taxCopy_cert,
          vin_no: newBusData?.vin_no,
        },
      });
      return CommonRes.SUCCESS(
        "Successfully added the bus",
        newOnboardedBus,
        resObj,
        res
      );
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
      const getAllBusData = await this.prisma.bus_master.findMany();

      const filteredBusData = await excludeFields(getAllBusData, [
        "pollution_doc",
        "taxCopy_doc",
        "registrationCert_doc",
        "created_at",
        "updated_at",
      ]);

      console.log(filteredBusData, "========>>>>filtered data");

      if (!getAllBusData.length)
        return CommonRes.NOT_FOUND(
          "Data not found",
          getAllBusData,
          resObj,
          res
        );

      return CommonRes.SUCCESS(
        "Successfully fetched all bus details",
        filteredBusData,
        resObj,
        res
      );
    } catch (err) {
      console.log(err, "error in fetching bus list");
      return CommonRes.SERVER_ERROR(err, resObj, res);
    }
  };
}
