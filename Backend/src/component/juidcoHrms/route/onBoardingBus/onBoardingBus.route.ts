import express, { Request, Response } from "express";
import { baseUrl } from "../../../../util/common";
import multer, { Multer } from "multer";
import OnBoardingBusServices from "../../controller/onBoardingBus/onBoardingBus.services";

export default class OnBoardingBusRoute {
  constructor(app: express.Application) {
    const upload = multer({ dest: "public", limits: { fileSize: 2000000 } });
    // const storage = multer.diskStorage({
    //   destination: './public/',
    //   filename: function(req, file, cb) {
    //     cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    //   }
    // });
    const onBoardingBusServices = new OnBoardingBusServices();
    this.init(app, onBoardingBusServices, upload);
  }

  init(
    app: express.Application,
    onBoardingBusServices: OnBoardingBusServices,
    upload: Multer
  ): void {
    app
      .route(`${baseUrl}/onBoardingBus`)
      .post(upload.any(), (req: Request, res: Response) =>
        onBoardingBusServices.onBoardingNewBus(req, res, "021G")
      );
  }
}
