import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { resObj } from "../../../../util/types";
import { OnBoardingBusDataValidationSchema } from "../../validators/onBoardingBus/onBoardingBus.validator";
import CommonRes from "../../../../util/helper/commonResponse";
import { OnBoardingConductorDataValidationSchema } from "../../validators/onBoardingConductor/onBoardingConductor.validator";
import generateUniqueId from "../../../../util/helper/generateUniqueNo";
import { excludeFields } from "../../../../util/helper/excludeFieldsfromdbData";

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
        adhar_doc,
        adhar_no,
        fitness_doc,
      } = req.body;

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

      //checking if conductor already exist
      const isExistingConductor = await this.prisma.conductor_master.findUnique(
        {
          where: { adhar_no },
        }
      );

      if (isExistingConductor) {
        return CommonRes.VALIDATION_ERROR(
          "Already registered Conductor",
          resObj,
          res
        );
      }

      const newOnboardedConductor = await this.prisma.conductor_master.create({
        data: {
          first_name: firstName,
          middle_name: middleName,
          last_name: lastName,
          age,
          blood_grp: bloodGrp,
          mobile_no: mobileNo,
          email_id: emailId,
          emergency_mob_no: emergencyMobNo,
          adhar_doc,
          adhar_no,
          fitness_doc,
          cunique_id: 123,
        },
      });

      // const uniqueId = generateUnique();
      const cUniqueId = generateUniqueId(newOnboardedConductor?.id);
      console.log(cUniqueId, "uniqueId=================>");

      const updatingConductorDetails =
        await this.prisma.conductor_master.update({
          where: {
            adhar_no: newOnboardedConductor.adhar_no,
          },
          data: {
            cunique_id: parseInt(cUniqueId),
          },
        });

      const onBoardedConductorWithUniqueId = {
        ...newOnboardedConductor,
        cunique_id: cUniqueId,
      };

      return CommonRes.SUCCESS(
        "Successfully registered the conductor",
        updatingConductorDetails,
        resObj,
        res
      );
    } catch (err) {
      console.log(err, "error in onboarding new bus");
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
      const getAllConductorData = await this.prisma.conductor_master.findMany();

      const filteredBusData = await excludeFields(getAllConductorData, [
        "adhar_doc",
        "fitness_doc",
        "created_at",
        "updated_at",
      ]);

      if (!getAllConductorData.length)
        return CommonRes.NOT_FOUND(
          "Data not found",
          getAllConductorData,
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
