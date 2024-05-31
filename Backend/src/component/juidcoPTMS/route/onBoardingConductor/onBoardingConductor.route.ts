import express, { Request, Response } from "express";
import { baseUrl } from "../../../../util/common";
import OnBoardingConductorServices from "../../controller/onBoardingConductor/onBoardingConductor.services";

export default class OnBoardingConductorRoute {
  constructor(app: express.Application) {
    const onBoardingConductorServices = new OnBoardingConductorServices();
    this.init(app, onBoardingConductorServices);
  }

  init(
    app: express.Application,
    onBoardingConductorServices: OnBoardingConductorServices
  ): void {
    app
      .route(`${baseUrl}/onBoardingConductor`)
      .post((req: Request, res: Response) =>
        onBoardingConductorServices.onBoardingNewConductor(req, res, "021G")
      );

    app
      .route(`${baseUrl}/getAllConductorsList`)
      .get((req: Request, res: Response) =>
        onBoardingConductorServices.getAllConductorList(req, res, "021G")
      );

    app
      .route(`${baseUrl}/getConductorStatus`)
      .get((req: Request, res: Response) =>
        onBoardingConductorServices.getConductorStatus(req, res, "021G")
      );

    app
      .route(`${baseUrl}/validate-aadhar`)
      .post((req: Request, res: Response) =>
        onBoardingConductorServices.validate_aadhar(req, res, "021G")
      );
  }
}
