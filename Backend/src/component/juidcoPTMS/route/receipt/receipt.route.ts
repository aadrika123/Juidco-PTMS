import express, { Request, Response } from "express";
import ReceiptServices from "../../controller/receipt/receipt.services";
import { baseUrl } from "../../../../util/common";
import { responseTime } from "../../../../middleware/responseTime";

class ReceiptRoute {
  private receiptService: ReceiptServices;

  constructor(app: express.Application) {
    this.receiptService = new ReceiptServices();
    this.init(app, this.receiptService);
  }

  init(app: express.Application, receiptServices: ReceiptServices): void {
    app
      .route(`${baseUrl}/receipt/create`)
      .post((req: Request, res: Response) =>
        receiptServices.post(req, res, "0101")
      );

    app
      .route(`${baseUrl}/receipt/get`)
      .post(responseTime, (req: Request, res: Response) =>
        receiptServices.get(req, res, "0102")
      );
    app
      .route(`${baseUrl}/passenger/day-wise`)
      .post(responseTime, (req: Request, res: Response) =>
        receiptServices.passenger_status(req, res, "0102")
      );
  }
}
export default ReceiptRoute;
