import express, { Request, Response } from "express";
import { baseUrl } from "../../../../util/common";
// import BusGenerateReportServices from "../../controller/reportGeneration/busReport.services";
import ReportController from "../../controller/report/report.controller";

export default class BusReportRoute {
  constructor(app: express.Application) {
    // const busGenerateReportServices = new BusGenerateReportServices();
    const reportController = new ReportController();
    // this.init(app, busGenerateReportServices);
    this.init(app, reportController);
  }

  init(
    app: express.Application,
    // busGenerateReportServices: BusGenerateReportServices
    reportGeneration: ReportController
  ): void {
    app
      .route(`${baseUrl}/report/bus-daywise`)
      .post((req: Request, res: Response) =>
        reportGeneration.get(req, res, "0501")
      );

    app
      .route(`${baseUrl}/report/bus-daywise/total`)
      .post((req: Request, res: Response) =>
        reportGeneration.getTotalAmount(req, res, "0502")
      );

    app
      .route(`${baseUrl}/report/real-time`)
      .get((req: Request, res: Response) =>
        reportGeneration.getRealTimeCollection(req, res, "0503")
      );

    app
      .route(`${baseUrl}/report/all`)
      .post((req: Request, res: Response) =>
        reportGeneration.generateAllReports(req, res, "0504")
      );
  }
}
