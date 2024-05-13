import express, { Request, Response, NextFunction } from "express";
import ReceiptServices from "../../controller/receipt/receipt.services";
import { baseUrl } from "../../../../util/common";
import multer from "multer";
import { UploadImgServices } from "../../controller/common/uploadImg.services";

const storage = multer.memoryStorage();

export const upload = multer({ storage: storage });

export default class UploadImgRoute {
  constructor(app: express.Application) {
    const uploadImgServices = new UploadImgServices();
    this.init(app, uploadImgServices);
  }

  init(app: express.Application, uploadImgServices: UploadImgServices): void {
    app
      .route(`${baseUrl}/common/img-upload`)
      .post(
        upload.single("img"),
        (req: Request, res: Response, next: NextFunction) =>
          uploadImgServices.imageUpload(req, res, next, "69.0")
      );
  }
}
