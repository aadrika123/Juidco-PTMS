import express, { Request, Response } from "express";
import { baseUrl } from "../../../../util/common";
import multer, { Multer } from "multer";
import OnBoardingBusServices from "../../controller/onBoardingBus/onBoardingBus.services";
import BusGenerateReportServices from "../../controller/reportGeneration/busReport.services";

export default class BusReportRoute {
  constructor(app: express.Application) {
    const busGenerateReportServices = new BusGenerateReportServices();
    this.init(app, busGenerateReportServices);
  }

  init(
    app: express.Application,
    busGenerateReportServices: BusGenerateReportServices
  ): void {
    app
      .route(`${baseUrl}/report/bus-daywise`)
      .post((req: Request, res: Response) =>
        busGenerateReportServices.getDayCollection(req, res, "051P")
      );

    app
      .route(`${baseUrl}/report/bus-monthwise`)
      .post((req: Request, res: Response) =>
        busGenerateReportServices.getMonthlyCollection(req, res, "051G")
      );
  }
}
