import express, { Request, Response } from "express";
import { baseUrl } from "../../../../util/common";
import BusConductorScheduleServices from "../../controller/busConductorSchedule/busConductorSchedule.services";

export default class BusConductorScheduleRoute {
  constructor(app: express.Application) {
    const busConductorScheduleServices = new BusConductorScheduleServices();
    this.init(app, busConductorScheduleServices);
  }

  init(
    app: express.Application,
    busConductorScheduleServices: BusConductorScheduleServices
  ): void {
    app
      .route(`${baseUrl}/schedule/create-new-schedule`)
      .post((req: Request, res: Response) =>
        busConductorScheduleServices.createScheduleBusConductor(
          req,
          res,
          "041P"
        )
      );

    app
      .route(`${baseUrl}/schedule/get-scheduleStatus`)
      .post((req: Request, res: Response) =>
        busConductorScheduleServices.getScheduleBusConductorStatus(
          req,
          res,
          "041G"
        )
      );

    app
      .route(`${baseUrl}/schedule/update-schedule`)
      .put((req: Request, res: Response) =>
        busConductorScheduleServices.updateScheduleBusConductor(
          req,
          res,
          "042P"
        )
      );

    app
      .route(`${baseUrl}/schedule/getAll`)
      .get((req: Request, res: Response) =>
        busConductorScheduleServices.getScheduleBusConductor(req, res, "042P")
      );

    app
      .route(`${baseUrl}/schedule/delete`)
      .get((req: Request, res: Response) =>
        busConductorScheduleServices.deleteScheduleBusConductor(
          req,
          res,
          "042P"
        )
      );

    app
      .route(`${baseUrl}/schedule/present`)
      .post((req: Request, res: Response) =>
        busConductorScheduleServices.todaySchedulesBuses(req, res, "042P")
      );

    app
      .route(`${baseUrl}/getScheduledConductor`)
      .post((req: Request, res: Response) =>
        busConductorScheduleServices.getBusScheduleConductor(req, res, "042P")
      );
  }
}
