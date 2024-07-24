import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
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
      const intConductorId = parseInt(conductor_id);

      //validation
      await ConductorReportValidationSchema.validate(req.body);

      const setDate = new Date(currentDate);

      // const dailyCollectionReport = await this.prisma.$queryRaw<any[]>`
      // SELECT bus_id, SUM(amount)::INTEGER AS "Total Amount"
      // FROM receipts
      // WHERE conductor_id = ${intConductorId} and date::date = ${setDate}::date
      // GROUP BY bus_id
      // left join scheduler
      // WHERE conductor_id = ${intConductorId} and date::date = ${setDate}::date
      // `;

      const dailyCollectionReport = await this.prisma.$queryRaw<any[]>`
        select rr.bus_id, rr.total_amount, ss.from_time, ss.to_time from (
        (SELECT r.bus_id, SUM(r.amount)::INTEGER AS "total_amount"
        FROM receipts r 
        WHERE r.conductor_id = ${intConductorId}
        AND r.date::date = ${setDate}::date
        GROUP BY r.bus_id) rr
        
        left join 
        
        (select * from scheduler s
        where s.date::date = ${setDate}::date and s.conductor_id = ${intConductorId}) ss 
        
        on rr.bus_id = ss.bus_id);
     `;

      console.log(intConductorId);

      console.log(dailyCollectionReport, "dailyCollectionReport=========>>");

      // const dailyCollectionReportss = await this.prisma.$queryRaw`
      // SELECT from_time to_time
      // FROM scheduler
      // WHERE conductor_id = ${intConductorId} and date::date = ${setDate}::date and bus_id= ${dailyCollectionReport.bus_id}
      // GROUP BY from_time to_time;
      // `;

      // checking if conductor already exist
      // const getDailyReport = await this.prisma.receipts.aggregate({
      //   where: { conductor_id: intConductorId, date: setDate },
      //   _sum: {
      //     amount: true,
      //   },
      // });

      // const getDailyData = await this.prisma.receipts.findMany({
      //   where: { conductor_id: intConductorId, date: setDate },
      // });

      // const newData = {
      //   total_amount: getDailyReport._sum.amount,
      //   data: getDailyData,
      // };
      // console.log(getDailyReport, "getDailyReport==========>>>");

      return CommonRes.SUCCESS(
        "Daily collection generated successfully",
        dailyCollectionReport,
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
        receipts
        where conductor_id = ${Number(
          conductor_id
        )} and EXTRACT(MONTH FROM date) = ${Number(
        onlyMonth
      )} and EXTRACT(YEAR FROM date) = ${Number(onlyYear)}
        `;
      console.log("first", query);

      const totalAmount = query.reduce((total, item) => total + item.amount, 0);
      const newRes = { data: query, totalAmount };

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
