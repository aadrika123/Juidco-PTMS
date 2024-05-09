import express, { Request, Response } from "express";
import ReceiptController from "../../controller/receipt/receipt.controller";
import { baseUrl } from "../../../../util/common";
class ReceiptRoute {
  private receiptController: ReceiptController;

  constructor() {
    this.receiptController = new ReceiptController();
  }

  configure(app: express.Application): void {
    app
      .route(`${baseUrl}/receipt/create`)
      .post((req: Request, res: Response) =>
        this.receiptController.post(req, res, "0101")
      );
  }
}
export default ReceiptRoute;
