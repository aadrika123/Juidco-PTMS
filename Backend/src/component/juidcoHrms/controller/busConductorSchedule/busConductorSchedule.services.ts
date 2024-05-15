import express, { Request, Response } from "express";
import CommonRes from "../../../../util/helper/commonResponse";
import { PrismaClient } from "@prisma/client";
import { resObj } from "../../../../util/types";
import { ScheduleBusConductorValidationSchema } from "../../validators/scheduleBusConductor/scheduleBusConductor.validator";

export default class BusConductorScheduleServices {
  public prisma = new PrismaClient();
  constructor() {}

  getScheduleBusConductorStatus = async (
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
      const { bus_no, conductor_id, date, from_time, to_time } = req.body;

      //validation error
      const isValidated = await ScheduleBusConductorValidationSchema.validate(
        req.body
      );

      const setDate = new Date(date).toISOString();

      //   const setTime = time.split(":").join(",");
      const setFromTime = Number(from_time.replace(":", "").padStart(4, "0"));
      const setToTime = Number(to_time.replace(":", "").padStart(4, "0"));

      console.log(
        setFromTime,
        setToTime,
        "settimegetScheduleBusConductorStatus=========>"
      );
      console.log(setDate, "setDate============");

      if (!Object.keys(isValidated).length) {
        return CommonRes.VALIDATION_ERROR("Validation error", resObj, res);
      }

      //checking if schedule already exist
      const isExistingSchedule = await this.prisma.busConductorMapping.findMany(
        {
          where: {
            bus_no,
            conductor_id,
            date: setDate,
            from_time: setFromTime,
            to_time: setToTime,
          },
        }
      );

      console.log(isExistingSchedule, "isexistingsche=============>>");

      if (isExistingSchedule.length > 0) {
        return CommonRes.SUCCESS(
          "Schedule already exists",
          isExistingSchedule,
          resObj,
          res
        );
      }
      return CommonRes.NOT_FOUND(
        "Schedule not found",
        isExistingSchedule,
        resObj,
        res
      );
    } catch (err) {
      console.log(err, "error in getting scheduled driver to bus");
      return CommonRes.SERVER_ERROR(err, resObj, res);
    }
  };

  createScheduleBusConductor = async (
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
      const { bus_no, conductor_id, date, from_time, to_time } = req.body;

      //validation error
      const isValidated = await ScheduleBusConductorValidationSchema.validate(
        req.body
      );
      //   const setTime = time.split(":").join(",");
      const setFromTime = Number(from_time.replace(":", "").padStart(4, "0"));
      const setToTime = Number(to_time.replace(":", "").padStart(4, "0"));

      console.log(
        setFromTime,
        setToTime,
        "settimegetcreateScheduleBusConductor=========>"
      );

      const setDate = new Date(date).toISOString();

      if (!Object.keys(isValidated).length) {
        return CommonRes.VALIDATION_ERROR("Validation error", resObj, res);
      }

      //checking if schedule already exist
      const isExistingSchedule = await this.prisma.busConductorMapping.findMany(
        {
          where: {
            bus_no,
            conductor_id,
            date: setDate,
            from_time: setFromTime,
            to_time: setToTime,
          },
        }
      );

      if (isExistingSchedule.length > 0) {
        return CommonRes.VALIDATION_ERROR(
          "Schedule already exists",
          resObj,
          res
        );
      }

      const createNewSchedule = await this.prisma.busConductorMapping.create({
        data: {
          bus_no,
          conductor_id,
          date: setDate,
          from_time: setFromTime,
          to_time: setToTime,
        },
      });

      return CommonRes.SUCCESS(
        "Successfully created Scheduled!!",
        createNewSchedule,
        resObj,
        res
      );
    } catch (err) {
      console.log(err, "error in onboarding new bus");
      return CommonRes.SERVER_ERROR(err, resObj, res);
    }
  };

  updateScheduleBusConductor = async (
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
      const { bus_no, conductor_id, date, from_time, to_time } = req.body;

      //validation error
      const isValidated = await ScheduleBusConductorValidationSchema.validate(
        req.body
      );

      const setDate = new Date(date).toISOString();

      const setFromTime = Number(from_time.replace(":", "").padStart(4, "0"));
      const setToTime = Number(to_time.replace(":", "").padStart(4, "0"));

      console.log(
        setFromTime,
        setToTime,
        "settimegetupdateScheduleBusConductor=========>"
      );

      if (!Object.keys(isValidated).length) {
        return CommonRes.VALIDATION_ERROR("Validation error", resObj, res);
      }

      const existingSchedule = await this.prisma.busConductorMapping.findFirst({
        where: {
          bus_no,
          conductor_id,
          date: setDate,
          from_time: setFromTime,
          to_time: setToTime,
        },
      });

      //updating already existschedule
      const updatingExistingSchedule =
        await this.prisma.busConductorMapping.update({
          where: { id: existingSchedule?.id },
          data: {
            bus_no,
            conductor_id,
            date: setDate,
            from_time: setFromTime,
            to_time: setToTime,
          },
        });

      return CommonRes.SUCCESS(
        "Successfully created Scheduled!!",
        updatingExistingSchedule,
        resObj,
        res
      );
    } catch (err) {
      console.log(err, "error in updating already created schedule");
      return CommonRes.SERVER_ERROR(err, resObj, res);
    }
  };
}
