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
    // app
    //   .route(`${baseUrl}/report/bus-monthwise`)
    //   .post((req: Request, res: Response) =>
    //     busGenerateReportServices.getMonthlyCollection(req, res, "051G")
    //   );
  }
}
