import express, { Request, Response } from "express";
import { baseUrl } from "../../../../util/common";
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
        onBoardingBusServices.onBoardingNewBus(req, res, "0201")
      );

    app
      .route(`${baseUrl}/getAllBusList`)
      .get((req: Request, res: Response) =>
        onBoardingBusServices.getAllBusList(req, res, "0202")
      );
    app
      .route(`${baseUrl}/bus/update`)
      .post((req: Request, res: Response) =>
        onBoardingBusServices.updateBusDetails(req, res, "0203")
      );

    app
      .route(`${baseUrl}/bus/delete`)
      .post((req: Request, res: Response) =>
        onBoardingBusServices.deleteBus(req, res, "0204")
      );

    app
      .route(`${baseUrl}/bus/image/:id`)
      .get((req: Request, res: Response) =>
        onBoardingBusServices.getBusImage(req, res, "0205")
      );

    app
      .route(`${baseUrl}/bus/update/v2`)
      .post((req: Request, res: Response) =>
        onBoardingBusServices.updateBusDetailsV2(req, res, "0206")
      );

  }
}
