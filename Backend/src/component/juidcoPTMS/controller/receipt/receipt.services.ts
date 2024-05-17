import { Request, Response } from "express";
import ReceiptDao from "../../dao/receipt/receipt.dao";
import CommonRes from "../../../../util/helper/commonResponse";
import { resMessage } from "../../../../util/common";
import { resObj } from "../../../../util/types";
import { receiptValidationSchema } from "../../validators/receipt/receipt.validator";

class ReceiptServices {
  private receiptDao: ReceiptDao;
  private initMsg: string;
  constructor() {
    this.receiptDao = new ReceiptDao();
    this.initMsg = "Receipt";
  }

  get = async (req: Request, res: Response, apiId: string) => {
    const resObj: resObj = {
      apiId,
      action: "GET",
      version: "1.0",
    };

    try {
      const data = await this.receiptDao.get();
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

  post = async (req: Request, res: Response, apiId: string) => {
    const resObj: resObj = {
      apiId,
      action: "GET",
      version: "1.0",
    };

    // console.log(req.body.data, "body data receipt========>>");

    try {
      const setTime = req.body.data.time.replace(":", "").padStart(4, "0");
      req.body.data.receipt_no = "123445";
      // req.body.data.date = new Date();
      req.body.data.time = setTime;
      // const receipt_No =
      //   "T" +
      //   new Date(req.body.data.date).toString() +
      //   "-" +
      //   Math.random().toString(36);
      // console.log(receipt_No);
      await receiptValidationSchema.validate(req.body.data);
      const data = await this.receiptDao.post(req);

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

export default ReceiptServices;
