import { Request, Response } from 'express';
import AccountsSummaryDAO from '../../dao/accountant/AccountsSummaryDAO';
// import { v4 as uuidv4 } from 'uuid';
import CommonRes from "../../../../util/helper/commonResponse";
import { resMessage } from '../../../../util/common';
import { resObj } from '../../../../util/types';
import * as Yup from "yup";
import { AccountsType } from "../../../../util/types/accountant/accountant.type";
import { AccountValidatorData, AccountValidatorDataSchema } from '../../validators/accountant/accountant.validator1';

export default class AccountsSummaryController {
    private accountsSummaryDAO: AccountsSummaryDAO;
    private initMsg: string;

    constructor() {
        this.accountsSummaryDAO = new AccountsSummaryDAO();
        this.initMsg = 'Accounts Summary';
    }

   //post api-----
    generateDayWiseReport = async (req: Request, res: Response): Promise<void> => {
        const resObj: resObj = {
            apiId: '0502',
            action: 'POST',
            version: '1.0',
        };

        try {
            // 2. Post The data from frontend to Acountant Table prams-- 
            // > Conductor ID, system Date, Total Amount, Busid, Status = 0(Not validated)
            const { conductor_id,date,total_amount,bus_id} = req.body;

            if (!conductor_id || !date || !total_amount||!bus_id ) {
                return CommonRes.BAD_REQUEST('Conductor ID and date and total amount busid required', resObj, res);
            }

            // Fetch the total amount for the given conductor_id and date
            // const totalAmountData = await this.accountsSummaryDAO.getTotalAmount(conductor_id, new Date(date));
            const { name } = await this.accountsSummaryDAO.getName(conductor_id);
            // const { bus_id } = await this.accountsSummaryDAO.getbus_id(conductor_id);



            // In-memory storage for the last sequence by date
            let lastSequenceByDate: Record<string, number> = {};

            const generateCustomTransactionNo = (): string => {
                const prefix = 'TR'; // Prefix for the transaction ID

                // Get current date in YYYYMMDD format
                const currentDate = new Date();
                const year = currentDate.getFullYear(); // Get full year (YYYY)
                const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
                const day = currentDate.getDate().toString().padStart(2, '0');

                // Generate a random number between 1 and 999 for the sequence
                const randomSequence = Math.floor(Math.random() * 999) + 1;
                const sequenceStr = randomSequence.toString().padStart(3, '0');

                return `${prefix}${year}${month}${day}${sequenceStr}`;
            };

            const transaction_id = generateCustomTransactionNo();
            console.log(transaction_id);

            // console.log(transaction_id);

            // Create summary data with updated status
            const summaryData: AccountsType = {
                transaction_id,
                conductor_id,
                total_amount: total_amount,
                date: new Date(), // Ensure date is of type Date
                time: new Date().toLocaleTimeString('en-GB', { timeZone: 'Asia/Kolkata' }),
                description: 'Transaction Summary',
                transaction_type: 'Credit',
                conductor_name: name,
                bus_id: bus_id,
                status: 0, // Updated status
            };

            // Validate summaryData using Yup schema
            await AccountValidatorDataSchema.validate(summaryData);

            // Proceed if valid
            const validatedData = AccountValidatorData(summaryData);

            // Create a new record in the accounts_summary table
            const newSummary = await this.accountsSummaryDAO.createSummary(validatedData);

            CommonRes.SUCCESS(
                resMessage(this.initMsg).CREATED,
                newSummary,
                resObj,
                res
            );
        } catch (error) {
            if (error instanceof Yup.ValidationError) {
                return CommonRes.BAD_REQUEST(error.message, resObj, res);
            }
            CommonRes.SERVER_ERROR(error, resObj, res);
        }
    };

    // 


    //get api-----
    getTotalAmountByConductorId = async (req: Request, res: Response): Promise<void> => {
        const resObj: resObj = {
            apiId: '0503',
            action: 'GET',
            version: '1.0',
        };

        try {
            // Cast the query params to string
            const bus_id = req.query.bus_id as string;
            const dateString = req.query.date as string;
            const conductor_id = req.query.conductor_id as string;

            if (!conductor_id) {
                return CommonRes.BAD_REQUEST('Conductor ID is required', resObj, res);
            }
            if (!bus_id) {
                return CommonRes.BAD_REQUEST('Bus ID is required', resObj, res);
            }
            if (!dateString) {
                return CommonRes.BAD_REQUEST('Date is required', resObj, res);
            }

            // Convert the date string to a Date object
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                return CommonRes.BAD_REQUEST('Invalid Date format', resObj, res);
            }

            // Assuming your accountsSummaryDAO function takes Date
            const totalAmountByConductorId = await this.accountsSummaryDAO.getTotalAmountByConductorId(conductor_id, bus_id, date);

            CommonRes.SUCCESS(
                'Summary data retrieved successfully',
                totalAmountByConductorId,
                resObj,
                res
            );
        } catch (error) {
            CommonRes.SERVER_ERROR(error, resObj, res);
        }
    };
    // api

// Controller method to get all transactions with status 0 (Not Validated)
getUnvalidatedTransactions = async (req: Request, res: Response): Promise<void> => {
    const resObj: resObj = {
        apiId: '0504',
        action: 'GET',
        version: '1.0',
    };

    try {
        // Call the DAO method to get transactions with status 0
        const transactions = await this.accountsSummaryDAO.getTransactionsByStatus(0);

        // Return the response with the fetched transactions
        CommonRes.SUCCESS(
            'Transactions retrieved successfully',
            transactions,
            resObj,
            res
        );
    } catch (error) {
        CommonRes.SERVER_ERROR(error, resObj, res);
    }
};


    
    getScheduledBusesAndConductors = async (req: Request, res: Response): Promise<void> => {
        const resObj: resObj = {
            apiId: '0505',
            action: 'GET',
            version: '1.0',
        };

        try {
            // Extract date from query parameters
            const { date } = req.query;

            if (!date || typeof date !== 'string') {
                return CommonRes.BAD_REQUEST('Date is required and must be a string', resObj, res);
            }

            // Parse the date query parameter
            const parsedDate = new Date(date);
            if (isNaN(parsedDate.getTime())) {
                return CommonRes.BAD_REQUEST('Invalid date format', resObj, res);
            }

            // Fetch the scheduled buses and conductors for the given date
            const schedules = await this.accountsSummaryDAO.getScheduledBusesAndConductors(parsedDate);

            // Return the response with the fetched data
            CommonRes.SUCCESS(
                'Scheduled buses and conductors retrieved successfully',
                schedules,
                resObj,
                res
            );
        } catch (error) {
            CommonRes.SERVER_ERROR(error, resObj, res);
        }
    };



    // controllers/summaryController.ts



getConductorSummary = async (req: Request, res: Response): Promise<void> => {
    const resObj = {
        apiId: '0505',
        action: 'GET',
        version: '1.0',
    };

    try {
        const { conductor_id } = req.params;

        if (!conductor_id) {
            return CommonRes.BAD_REQUEST('Conductor ID is required', resObj, res);
        }

        const transactions = await this.accountsSummaryDAO.transactions(conductor_id);

        if (transactions.length === 0) {
            return CommonRes.BAD_REQUEST('No transactions found for the conductor', resObj, res);
        }

        // Extract conductor name from the first transaction
        const conductor_name = transactions[0].conductor_name;

        const totalAmount = transactions.reduce((sum, transaction) => sum + transaction.total_amount, 0);
        const totalTransactions = transactions.length;

        const summary = {
            conductor_name,
            total_amount: totalAmount,
            total_transactions: totalTransactions,
            transactions: transactions.map(tx => ({
                transaction_id: tx.transaction_id,
                date: tx.date,
                time: tx.time,
                description: tx.description,
                transaction_type: tx.transaction_type,
                bus_id: tx.bus_id,
                status: tx.status
            }))
        };

        CommonRes.SUCCESS(
            'Scheduled buses and conductors retrieved successfully',
            summary,
            resObj,
            res
        );

    } catch (error) {
        CommonRes.SERVER_ERROR(error, resObj, res);
    }
    }


  updateTransactionStatus = async (req: Request, res: Response): Promise<void> => {
    const resObj = {
        apiId: '0506',
        action: 'PUT',
        version: '1.0',
    };

    try {
        const { transaction_id, status } = req.body;

        // Validate input
        if (!transaction_id || typeof status !== 'number') {
            return CommonRes.BAD_REQUEST('Transaction ID and status are required', resObj, res);
        }

        // Validate status value
        if (![0, 1, 2].includes(status)) {
            return CommonRes.BAD_REQUEST('Invalid status value', resObj, res);
        }

        // Update the status in the database using DAO
        const updatedTransaction = await this.accountsSummaryDAO.updateTransactionStatus(transaction_id, status);

        // Respond with success
        CommonRes.SUCCESS(
            'Transaction status updated successfully',
            updatedTransaction,
            resObj,
            res
        );

    } catch (error) {
        CommonRes.SERVER_ERROR(error, resObj, res);
    }
};

};

