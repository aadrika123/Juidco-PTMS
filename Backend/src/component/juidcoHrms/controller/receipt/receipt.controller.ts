import { Request, Response } from "express";
import ReceiptDao from "../../dao/receipt/receipt.dao";
import CommonRes from "../../../../util/helper/commonResponse";
import { resMessage } from "../../../../util/common";
import { resObj } from "../../../../util/types";
import { receiptValidationSchema } from "../../requests/receipt/receipt.request";
import { generateUnique } from "../../../../util/helper/generateUniqueNo";

class ReceiptController {
  private receiptDao: ReceiptDao;
  private initMsg: string;
  constructor() {
    this.receiptDao = new ReceiptDao();
    this.initMsg = "Receipt";
  }

  post = async (req: Request, res: Response, apiId: string) => {
    const resObj: resObj = {
      apiId,
      action: "GET",
      version: "1.0",
    };

    const receipt_no = generateUnique("T");
   
    
    try {
      req.body.data.receipt_no = receipt_no;
      req.body.data.date = new Date();
      const receipt_No = "T"+  new Date(req.body.data.date).toString() + '-'+ Math.random().toString(36);
      console.log(receipt_No)

      await receiptValidationSchema.validate(req.body.data)
      
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

export default ReceiptController;
