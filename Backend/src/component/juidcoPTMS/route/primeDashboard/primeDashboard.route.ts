import express, { Request, Response } from "express";
import primeDashboardServices from "../../controller/primeDashboard/primeDashboard.services";
import { baseUrl } from "../../../../util/common";

class PrimeDashboardRoute {
  private primeDashboardServices: primeDashboardServices;

  constructor(app: express.Application) {
    this.primeDashboardServices = new primeDashboardServices();
    this.init(app, this.primeDashboardServices);
  }

  init(app: express.Application, primeDashboardServices: primeDashboardServices): void {
    app
      .route(`${baseUrl}/prime-dashboard`)
      .get((req: Request, res: Response) =>
        primeDashboardServices.getDashboardData(req, res, "0600")
      );
  }
}
export default PrimeDashboardRoute;
