import { Request, Response } from "express";
import PrimeDashboardDao from "../../dao/primeDashboard/primeDashboard.dao";
import CommonRes from "../../../../util/helper/commonResponse";
import { resMessage } from "../../../../util/common";
import { resObj } from "../../../../util/types";

class primeDashboardServices {
  private primeDashboardDao: PrimeDashboardDao;
  private initMsg: string;
  constructor() {
    this.primeDashboardDao = new PrimeDashboardDao();
    this.initMsg = "Prime dashboard data";
  }

  getDashboardData = async (req: Request, res: Response, apiId: string) => {
    const resObj: resObj = {
      apiId,
      action: "GET",
      version: "1.0",
    };

    try {
      const { ulbId } = req.query;

      const data = await this.primeDashboardDao.getDashboardData(
        ulbId ? Number(ulbId) : undefined
      );

      if (!data) {
        return CommonRes.NOT_FOUND(
          resMessage(this.initMsg).NOT_FOUND,
          data,
          resObj,
          res
        );
      }

      return CommonRes.SUCCESS(
        resMessage(this.initMsg).FOUND,
        data,
        resObj,
        res
      );
    } catch (error) {
      return CommonRes.SERVER_ERROR(error, resObj, res);
    }
  };
}

export default primeDashboardServices;
