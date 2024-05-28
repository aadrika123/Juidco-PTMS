import { Request, Response } from "express";
import CommonRes from "../../../../util/helper/commonResponse";
import { PrismaClient } from "@prisma/client";
import { resObj } from "../../../../util/types";
import { ScheduleBusConductorValidationSchema } from "../../validators/scheduleBusConductor/scheduleBusConductor.validator";
import BusConductorScheduleDao from "../../dao/busConductorSchedule/busConductorSchedule.dao";
import { sendResponse } from "../../../../util/sendResponse";

export default class BusConductorScheduleServices {
  public prisma = new PrismaClient();
  private busConductorSchedule: BusConductorScheduleDao;
  constructor() {
    this.busConductorSchedule = new BusConductorScheduleDao();
  }

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
      // ---------------------- VALIDATION --------------------------------
      const isValidated = await ScheduleBusConductorValidationSchema.validate(
        req.body
      );

      if (!Object.keys(isValidated).length) {
        return CommonRes.VALIDATION_ERROR("Validation error", resObj, res);
      }

      const data = await this.busConductorSchedule.createScheduleBusConductor(
        req
      );

      console.log(data.error_type, "data");
      if (data.error_type === "VALIDATION") {
        console.log(data);
        return sendResponse(
          true,
          false,
          { data: data },
          200,
          resObj.action,
          resObj.apiId,
          resObj.version,
          res
        );
      }
      // ---------------------- VALIDATION --------------------------------

      return CommonRes.SUCCESS(
        "Successfully Scheduled the bus and conductor",
        data,
        resObj,
        res
      );
    } catch (err) {
      return CommonRes.SERVER_ERROR(err, resObj, res);
    }
  };

  getScheduleBusConductor = async (
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
      const data = await this.busConductorSchedule.getScheduleBusConductor(req);
      if (!data) {
        return CommonRes.NOT_FOUND("Schedule Not Found", data, resObj, res);
      }

      return CommonRes.SUCCESS(
        "Successfully updated Schedule",
        data,
        resObj,
        res
      );
    } catch (err) {
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
      //validation error
      const isValidated = await ScheduleBusConductorValidationSchema.validate(
        req.body
      );

      if (!Object.keys(isValidated).length) {
        return CommonRes.VALIDATION_ERROR("Validation error", resObj, res);
      }

      const data = await this.busConductorSchedule.updateScheduleBusConductor(
        req
      );
      if (!data) {
        return CommonRes.NOT_FOUND("Schedule Not Found", data, resObj, res);
      }

      return CommonRes.SUCCESS(
        "Successfully updated Schedule",
        data,
        resObj,
        res
      );
    } catch (err) {
      return CommonRes.SERVER_ERROR(err, resObj, res);
    }
  };
  deleteScheduleBusConductor = async (
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
      const data = await this.busConductorSchedule.deleteScheduleBusConductor(
        req
      );
      if (!data) {
        return CommonRes.NOT_FOUND("Schedule Not Found", data, resObj, res);
      }

      return CommonRes.SUCCESS(
        "Successfully updated Schedule",
        data,
        resObj,
        res
      );
    } catch (err) {
      return CommonRes.SERVER_ERROR(err, resObj, res);
    }
  };
  todaySchedulesBuses = async (req: Request, res: Response, apiId: string) => {
    const resObj: resObj = {
      apiId,
      action: "GET",
      version: "1.0",
    };

    try {
      const data = await this.busConductorSchedule.todaySchedulesBuses(req);
      if (!data) {
        return CommonRes.NOT_FOUND("Schedule Not Found", data, resObj, res);
      }

      return CommonRes.SUCCESS(
        "Successfully found Schedule",
        data,
        resObj,
        res
      );
    } catch (err) {
      return CommonRes.SERVER_ERROR(err, resObj, res);
    }
  };

  getBusScheduleConductor = async (
    req: Request,
    res: Response,
    apiId: string
  ) => {
    const resObj: resObj = {
      apiId,
      action: "POST",
      version: "1.0",
    };

    try {
      const data = await this.busConductorSchedule.getBusScheduleConductor(req);

      return CommonRes.SUCCESS(
        "Successfully found Schedule",
        data,
        resObj,
        res
      );
    } catch (err) {
      return CommonRes.SERVER_ERROR(err, resObj, res);
    }
  };
}
