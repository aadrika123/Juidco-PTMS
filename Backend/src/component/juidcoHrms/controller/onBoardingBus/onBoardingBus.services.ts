import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { resObj } from "../../../../util/types";
import multer from "multer";
import { OnBoardingBusDataValidationSchema } from "../../validators/onBoardingBus/onBoardingBus.validator";
import { Prisma } from "@prisma/client";
import CommonRes from "../../../../util/helper/commonResponse";

type TOnBoardingBusData = {
  registration_no: string;
  vin_no: string;
  taxCopy_cert: string;
  registration_cert: string;
  pollution_cert: string;
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
      const { registration_no, vin_no } = req.body;
      const fileData = req.files;

      let newBusData: TOnBoardingBusData = {
        registration_no: "",
        vin_no: "",
        taxCopy_cert: "",
        registration_cert: "",
        pollution_cert: "",
      };

      //checking if bus already exist
      const isExistingBus = await this.prisma.onBoardedBusDetails.findUnique({
        where: { vin_no },
      });

      if (isExistingBus) {
        return CommonRes.VALIDATION_ERROR(
          "Already registered vehicle",
          resObj,
          res
        );
      }

      //validation of request body with files and json
      if (!registration_no || registration_no == "") {
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

      if (fileData && Array.isArray(fileData)) {
        const taxCopy_cert = fileData.find(
          (data: any) => data.fieldname === "taxCopy_cert"
        );

        const registration_cert = fileData.find(
          (data: any) => data.fieldname === "registration_cert"
        );
        const pollution_cert = fileData.find(
          (data: any) => data.fieldname === "pollution_cert"
        );

        if (taxCopy_cert == undefined || taxCopy_cert == null) {
          return CommonRes.VALIDATION_ERROR(
            "Tax Copy document is required",
            resObj,
            res
          );
        } else {
          newBusData = { ...newBusData, taxCopy_cert: taxCopy_cert.path };
        }

        if (registration_cert == undefined || registration_cert == null) {
          return CommonRes.VALIDATION_ERROR(
            "Registartion Certificate document is required",
            resObj,
            res
          );
        } else {
          newBusData = {
            ...newBusData,
            registration_cert: registration_cert.path,
          };
        }

        if (pollution_cert == undefined || pollution_cert == null) {
          return CommonRes.VALIDATION_ERROR(
            "Pollution Certificate document is required",
            resObj,
            res
          );
        } else {
          newBusData = { ...newBusData, pollution_cert: pollution_cert.path };
        }
      } else {
        return CommonRes.VALIDATION_ERROR(
          "No file data available or fileData is not an array",
          resObj,
          res
        );
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
      return CommonRes.SUCCESS(
        "Successfully added the bus",
        newOnboardedBus,
        resObj,
        res
      );

      // const existingBus = await this.prisma.onBoardingBusDetails.findUnique({ where: {vin_no}})
    } catch (err) {
      console.log(err, "error in onboarding new bus");
      return CommonRes.SERVER_ERROR(err, resObj, res);
    }
  };
}
