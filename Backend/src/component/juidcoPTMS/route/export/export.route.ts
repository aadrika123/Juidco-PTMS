import express, { Request, Response } from "express";
import { baseUrl } from "../../../../util/common";
import ExportServices from "../../controller/common/export.services";


export default class ExportRoute {
  constructor(app: express.Application) {
    const exportServices = new ExportServices();
    this.init(app, exportServices);
  }

  init(app: express.Application, exportServices: ExportServices): void {
    app
      .route(`${baseUrl}/common/export`)
      .get(
        (req: Request, res: Response) =>
          exportServices.exportCsv(req, res, "69.0")
      );
  }
}
