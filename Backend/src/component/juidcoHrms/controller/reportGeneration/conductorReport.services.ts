import express, { Request, Response } from "express";
import { Prisma, PrismaClient } from "@prisma/client";
import { resObj } from "../../../../util/types";
import CommonRes from "../../../../util/helper/commonResponse";
import {
  ConductorReportMonthlyValidationSchema,
  ConductorReportValidationSchema,
} from "../../validators/conductorReportGen/conductorReportValidator";

type TQuery = [
  {
    id: number;
    receipt_no: string;
    amount: number;
    date: Date;
    time: string;
    conductor_id: string;
    created_at: Date;
    updated_at: Date;
  }
];

export default class ConductorGenerateReportServices {
  public prisma = new PrismaClient();

  constructor() {}

  getDayCollection = async (req: Request, res: Response, apiId: string) => {
    const resObj: resObj = {
      apiId,
      action: "POST",
      version: "1.0",
    };

    try {
      const { currentDate, conductor_id } = req.body;

      //validation
      await ConductorReportValidationSchema.validate(req.body);

      const setDate = new Date(currentDate).toISOString();

      console.log(setDate, "setDate", currentDate, "currentDate");

      // checking if conductor already exist
      const getDailyReport = await this.prisma.receipt.aggregate({
        where: { conductor_id: conductor_id, date: setDate },
        _sum: {
          amount: true,
        },
      });

      const getDailyData = await this.prisma.receipt.findMany({
        where: { conductor_id: conductor_id, date: setDate },
      });
      // const getDailyReport = await this.prisma.$queryRaw`
      // select
      // sum(amount)::int as total_amount,
      // receipt_no,
      // amount::int,
      // date,
      // time,
      // conductor_id
      // from
      // receipt
      // where conductor_id=${conductor_id} and date=${setDate}::date
      // group by (receipt_no, amount, date,
      // time,
      // conductor_id)
      // `;

      const newData = {
        total_amount: getDailyReport._sum.amount,
        data: getDailyData,
      };
      console.log(getDailyReport, "getDailyReport==========>>>");

      return CommonRes.SUCCESS(
        "Daily collection generated successfully",
        newData,
        resObj,
        res
      );
    } catch (err) {
      console.log(err, "error in generating daily collection");
      return CommonRes.SERVER_ERROR(err, resObj, res);
    }
  };

  getMonthlyCollection = async (req: Request, res: Response, apiId: string) => {
    const resObj: resObj = {
      apiId,
      action: "POST",
      version: "1.0",
    };

    try {
      const { time, conductor_id } = req.body;

      //validation
      await ConductorReportMonthlyValidationSchema.validate(req.body);

      const onlyMonth = time.split("-")[1];
      const onlyYear = time.split("-")[0];

      if (!onlyMonth || !onlyYear)
        return CommonRes.VALIDATION_ERROR(
          "month and year not found",
          resObj,
          res
        );

      const query: TQuery = await this.prisma.$queryRaw`SELECT *
        from 
        receipt
        where conductor_id = ${conductor_id} and EXTRACT(MONTH FROM date) = ${Number(
        onlyMonth
      )} and EXTRACT(YEAR FROM date) = ${Number(onlyYear)}
        `;
      console.log("first", query);

      const totalAmount = query.reduce((total, item) => total + item.amount, 0);
      const newRes = { ...query, totalAmount };

      return CommonRes.SUCCESS(
        "Monthly collection generated successfully",
        newRes,
        resObj,
        res
      );
    } catch (err) {
      console.log(err, "error in generating monthly collection");
      return CommonRes.SERVER_ERROR(err, resObj, res);
    }
  };
}
