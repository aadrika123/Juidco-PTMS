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

      if (!Object.keys(isValidated).length) {
        return CommonRes.VALIDATION_ERROR("Validation error", resObj, res);
      }

      //checking if schedule already exist
      const isExistingSchedule = await this.prisma.scheduler.findMany({
        where: {
          bus_id: bus_no,
          conductor_id,
          date: setDate,
          from_time: setFromTime,
          to_time: setToTime,
        },
      });

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
      console.log(req.body, "============req body");

      //validation error
      const isValidated = await ScheduleBusConductorValidationSchema.validate(
        req.body
      );
      //   const setTime = time.split(":").join(",");
      const setFromTime = Number(from_time.replace(":", "").padStart(4, "0"));
      const setToTime = Number(to_time.replace(":", "").padStart(4, "0"));
      const intConductorId = parseInt(conductor_id);

      const setDate = new Date(date).toISOString();

      if (!Object.keys(isValidated).length) {
        return CommonRes.VALIDATION_ERROR("Validation error", resObj, res);
      }

      //checking if schedule already exist
      const isExistingSchedule = await this.prisma.scheduler.findMany({
        where: {
          bus_id: bus_no,
          conductor_id: intConductorId,
          date: setDate,
          from_time: setFromTime,
          to_time: setToTime,
        },
      });

      if (isExistingSchedule.length > 0) {
        return CommonRes.VALIDATION_ERROR(
          "Schedule already exists",
          resObj,
          res
        );
      }

      const createNewSchedule = await this.prisma.scheduler.create({
        data: {
          bus_id: bus_no,
          conductor_id: intConductorId,
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
      console.log(err, "error in ceating schedule");
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
      const intConductorId = parseInt(conductor_id);

      if (!Object.keys(isValidated).length) {
        return CommonRes.VALIDATION_ERROR("Validation error", resObj, res);
      }

      const existingSchedule = await this.prisma.scheduler.findFirst({
        where: {
          bus_id: bus_no,
          conductor_id: intConductorId,
          date: setDate,
          from_time: setFromTime,
          to_time: setToTime,
        },
      });

      //updating already existschedule
      const updatingExistingSchedule = await this.prisma.scheduler.update({
        where: { id: existingSchedule?.id },
        data: {
          bus_id: bus_no,
          conductor_id: intConductorId,
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
