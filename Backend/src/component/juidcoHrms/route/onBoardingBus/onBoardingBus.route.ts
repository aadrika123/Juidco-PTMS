import express, { Request, Response } from "express";
import { baseUrl } from "../../../../util/common";
import multer, { Multer } from "multer";
import OnBoardingBusServices from "../../controller/onBoardingBus/onBoardingBus.services";

export default class OnBoardingBusRoute {
  constructor(app: express.Application) {
    const onBoardingBusServices = new OnBoardingBusServices();
    this.init(app, onBoardingBusServices);
  }

  init(
    app: express.Application,
    onBoardingBusServices: OnBoardingBusServices
  ): void {
    app
      .route(`${baseUrl}/onBoardingBus`)
      .post((req: Request, res: Response) =>
        onBoardingBusServices.onBoardingNewBus(req, res, "021G")
      );
  }
}
