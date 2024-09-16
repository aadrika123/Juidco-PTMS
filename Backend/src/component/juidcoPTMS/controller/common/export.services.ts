import { Request, Response } from "express";
import CommonRes from "../../../../util/helper/commonResponse";
import { PrismaClient } from "@prisma/client";
import { resObj } from "../../../../util/types";
import { resMessage } from "../../../../util/common";

export default class ExportServices {
  public prisma = new PrismaClient();

  constructor() {

  }

  exportCsv = async (
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
      const type = req.query.type
      const { ulb_id } = req.body.auth
      let jsonData: any = []
      if (type === 'conductor') {
        jsonData = await this.prisma.conductor_master.findMany({
          where: {
            ulb_id: ulb_id
          },
          select: {
            id: true,
            first_name: true,
            last_name: true,
            mobile_no: true,
            emergency_mob_no: true,
            email_id: true,
            cunique_id: true
          }
        })
      } else {
        jsonData = await this.prisma.bus_master.findMany({
          where: {
            ulb_id: ulb_id
          },
          select: {
            register_no: true,
            vin_no: true,
          }
        })
      }

      if (jsonData.length !== 0) {
        const dataToExport = jsonData.map((item: any) => {
          if (type === 'conductor') {
            return {
              "ID": item?.cunique_id,
              "Name": `${item?.first_name} ${item?.last_name}`,
              "Mobile no.": item?.mobile_no,
              "Alternate mobile no.": item?.emergency_mob_no,
              "Email": item?.email_id,
            }
          } else {
            return {
              "ID": item?.register_no,
              "VIN/Chessis": item?.vin_no
            }
          }
        })
        return CommonRes.SUCCESS(
          resMessage("export data fetched successfully").FOUND,
          dataToExport,
          resObj,
          res
        );
      } else {
        return CommonRes.NOT_FOUND(
          resMessage("No data found").FOUND,
          jsonData,
          resObj,
          res
        );
      }

    } catch (err) {
      console.log(err, "error in export");
      return CommonRes.SERVER_ERROR(err, resObj, res);
    }
  };

}
