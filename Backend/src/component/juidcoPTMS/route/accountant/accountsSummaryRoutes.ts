import express, { Request, Response } from 'express';
import AccountsSummaryController from '../../controller/accountant/AccountsSummaryController';
import { baseUrl } from '../../../../util/common';

export default class AccountsSummaryRoutes {
    constructor(app: express.Application) {
        const accountsSummaryController = new AccountsSummaryController();
        this.init(app, accountsSummaryController);
    }

    init(app: express.Application, accountsSummaryController: AccountsSummaryController): void {
        app
            .route(`${baseUrl}/report/daywise_data`)
            .post((req: Request, res: Response) => accountsSummaryController.generateDayWiseReport(req, res));

        // New route to get summary data by conductor_id
        app
            .route(`${baseUrl}/report/total_amount`)
            .get((req: Request, res: Response) => accountsSummaryController.getTotalAmountByConductorId(req, res));

        app
            .route(`${baseUrl}/report/status`)
            .get((req: Request, res: Response) => accountsSummaryController.getUnvalidatedTransactions(req, res));

        app
            .route(`${baseUrl}/report/datewise`)
            .get((req: Request, res: Response) => accountsSummaryController.getScheduledBusesAndConductors(req, res));

        app
            .route(`${baseUrl}/report/conductor-details/:conductor_id`)
            .get((req: Request, res: Response) => accountsSummaryController.getConductorSummary(req, res));

        app
            .route(`${baseUrl}/report/validate`)
            .put((req: Request, res: Response) => accountsSummaryController.updateTransactionStatus(req, res));

        app
            .route(`${baseUrl}/Cash/validate/status`)
            .get((req: Request, res: Response) => accountsSummaryController.getAccountsByStatus(req, res));
    } 
    
    
}
