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

    app
      .route(`${baseUrl}/conductor/update/`)
      .post((req: Request, res: Response) =>
        onBoardingConductorServices.updateConductorDetails(req, res, "0206")
      );

    app
      .route(`${baseUrl}/conductor/:id`)
      .get((req: Request, res: Response) =>
        onBoardingConductorServices.getConductorById(req, res, "02083")
      );

    app
      .route(`${baseUrl}/conductor/image/:id`)
      .get((req: Request, res: Response) =>
        onBoardingConductorServices.getConductorImage(req, res, "021X")
      );

  }
}
