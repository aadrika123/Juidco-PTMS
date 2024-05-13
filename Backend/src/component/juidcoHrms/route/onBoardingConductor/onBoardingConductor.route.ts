import express, { Request, Response } from "express";
import { baseUrl } from "../../../../util/common";
import multer, { Multer } from "multer";
import OnBoardingConductorServices from "../../controller/onBoardingConductor/onBoardingConductor.services";

export default class OnBoardingConductorRoute {
  constructor(app: express.Application) {
    const upload = multer({ dest: "public", limits: { fileSize: 2000000 } });
    // const storage = multer.diskStorage({
    //   destination: './public/',
    //   filename: function(req, file, cb) {
    //     cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    //   }
    // });
    const onBoardingBusServices = new OnBoardingConductorServices();
    this.init(app, onBoardingBusServices, upload);
  }

  init(
    app: express.Application,
    onBoardingConductorServices: OnBoardingConductorServices,
    upload: Multer
  ): void {
    app
      .route(`${baseUrl}/onBoardingConductor`)
      .post(upload.any(), (req: Request, res: Response) =>
        onBoardingConductorServices.onBoardingNewConductor(req, res, "021G")
      );
  }
}
