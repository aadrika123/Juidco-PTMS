import { Request, Response } from 'express';
import AccountsSummaryDAO from '../../dao/accountant/AccountsSummaryDAO';
// import { v4 as uuidv4 } from 'uuid';
import { PrismaClient } from '@prisma/client';
import CommonRes from "../../../../util/helper/commonResponse";
import { resMessage } from '../../../../util/common';
import { resObj } from '../../../../util/types';
import * as Yup from "yup";
import { AccountsType } from "../../../../util/types/accountant/accountant.type";
import { AccountValidatorData, AccountValidatorDataSchema } from '../../validators/accountant/accountant.validator1';
const prisma = new PrismaClient();

export default class AccountsSummaryController {
  private accountsSummaryDAO: AccountsSummaryDAO;
  private initMsg: string;

  constructor() {
    this.accountsSummaryDAO = new AccountsSummaryDAO();
    this.initMsg = "Accounts Summary";
  }

  //post api-----
  generateDayWiseReport = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const resObj: resObj = {
      apiId: "0502",
      action: "POST",
      version: "1.0",
    };

    try {
      const { conductorId, date, amount, ulbId } = req.body;

      console.log(conductorId, date, amount, ulbId);

      if (
        !conductorId ||
        !date ||
        amount === null ||
        amount === undefined ||
        !ulbId
      ) {
        return CommonRes.BAD_REQUEST(
          "Conductor ID, date, total amount, ULID are required",
          resObj,
          res
        );
      }

      // Fetch the name of the conductor
      const { name } = await this.accountsSummaryDAO.getName(conductorId);

      // In-memory storage for the last sequence by date
      const generateCustomTransactionNo = async (
        ulbId: string
      ): Promise<string> => {
        const prefix = "TR"; // Prefix for the transaction ID

        // Get current date in DDMMYYYY format
        const currentDate = new Date();
        const day = currentDate.getDate().toString().padStart(2, "0");
        const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
        const year = currentDate.getFullYear();

        // Get the latest transaction ID from the database (order by descending transaction_id)
        const lastTransaction = await prisma.accounts_summary.findFirst({
          where: {
            transaction_id: {
              contains: `${prefix}${day}${month}${year}${ulbId}`, // Check for the current day and ULB
            },
          },
          orderBy: {
            transaction_id: "desc", // Order by descending to get the last transaction
          },
        });

        // Check if lastTransaction and transaction_id exist
        let newSequence = 1;
        if (lastTransaction?.transaction_id) {
          const lastTransactionId = lastTransaction.transaction_id;

          // Extract the sequence part (last 3 digits) from the last transaction ID
          const lastSequence = parseInt(
            lastTransactionId.split("-").pop()!,
            10
          ); // Add non-null assertion operator "!"
          newSequence = lastSequence + 1; // Increment the sequence number
        }

        // Zero-padding the sequence to 3 digits
        const sequenceStr = newSequence.toString().padStart(3, "0");

        // Return the new transaction ID in the format TRddmmyyyyulbid-001
        return `${prefix}${day}${month}${year}${ulbId}-${sequenceStr}`;
      };

      // Generate the transaction ID
      const transaction_id = await generateCustomTransactionNo(ulbId); // Await the async function
      console.log(transaction_id);

      // Create summary data
      const summaryData: AccountsType = {
        transaction_id,
        conductor_id: conductorId,
        total_amount: amount,
        date: new Date(),
        time: new Date().toLocaleTimeString("en-GB", {
          timeZone: "Asia/Kolkata",
        }),
        description: "Transaction Summary",
        transaction_type: "Credit",
        conductor_name: name,
        bus_id: "null",
        status: 0, // Updated status
      };

      // Validate summaryData using Yup schema
      await AccountValidatorDataSchema.validate(summaryData);

      // Proceed if valid
      const validatedData = AccountValidatorData(summaryData);

      // Create a new record in the accounts_summary table
      const newSummary = await this.accountsSummaryDAO.createSummary(
        validatedData
      );

      CommonRes.SUCCESS(
        resMessage(this.initMsg).CREATED,
        newSummary,
        resObj,
        res
      );
    } catch (error) {
      console.log(error);
      if (error instanceof Yup.ValidationError) {
        return CommonRes.BAD_REQUEST(error.message, resObj, res);
      }
      CommonRes.SERVER_ERROR(error, resObj, res);
    }
  };

  //

  //get api-----
  getTotalAmountByConductorId = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const resObj: resObj = {
      apiId: "0503",
      action: "GET",
      version: "1.0",
    };

    try {
      const dateString = req.query.date as string;
      const conductor_id = req.query.conductor_id as string;

      if (!conductor_id) {
        return CommonRes.BAD_REQUEST("Conductor ID is required", resObj, res);
      }

      if (!dateString) {
        return CommonRes.BAD_REQUEST("Date is required", resObj, res);
      }

      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return CommonRes.BAD_REQUEST("Invalid Date format", resObj, res);
      }

      // Fetch total amount where isvalidated is false
      const { total_amount } = await this.accountsSummaryDAO.getTotalAmount(
        conductor_id,
        date
      );

      CommonRes.SUCCESS(
        "Summary data retrieved successfully",
        { total_amount },
        resObj,
        res
      );
    } catch (error) {
      CommonRes.SERVER_ERROR(error, resObj, res);
    }
  };

  // api

  // Controller method to get all transactions with status 0 (Not Validated)

  getUnvalidatedTransactions = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const resObj: resObj = {
      apiId: "0504",
      action: "GET",
      version: "1.0",
    };

    try {
      // Fetch transactions with statuses 0, 1, 2, and 3 from the DAO, filtered by today's date
      const transactions =
        await this.accountsSummaryDAO.getUnvalidatedTransactions([0, 1, 2, 3]);

      // Get the current date
      const currentDate = new Date().toISOString().split("T")[0];

      // Group the transactions based on their status
      const groupedData = {
        Submitted_Cash: transactions
          .filter((t) => t.status === 0)
          .map((t) => ({
            id: t.conductor_id,
            date: t.date.toISOString().split("T")[0],
            time: t.time,
            amount: `₹${t.total_amount}`,
            payee: t.conductor_name,
            description: t.description, // Use the existing description from the database
            referenceNumber: t.transaction_id,
            status: t.status, // Include status
            currentDate: currentDate, // Include current date
          })),
        Validated_Cash: transactions
          .filter((t) => t.status === 1)
          .map((t) => ({
            id: t.conductor_id,
            date: t.date.toISOString().split("T")[0],
            time: t.time,
            amount: `₹${t.total_amount}`,
            payee: t.conductor_name,
            description: t.description, // Use the existing description from the database
            referenceNumber: t.transaction_id,
            status: t.status, // Include status
            currentDate: currentDate, // Include current date
          })),
        Disputed_Cash: transactions
          .filter((t) => t.status === 2)
          .map((t) => ({
            id: t.conductor_id,
            date: t.date.toISOString().split("T")[0],
            time: t.time,
            amount: `₹${t.total_amount}`,
            payee: t.conductor_name,
            description: t.description, // Use the existing description from the database
            referenceNumber: t.transaction_id,
            status: t.status, // Include status
            currentDate: currentDate, // Include current date
          })),
        Suspense_Cash: transactions
          .filter((t) => t.status === 3)
          .map((t) => ({
            id: t.conductor_id,
            date: t.date.toISOString().split("T")[0],
            time: t.time,
            amount: `₹${t.total_amount}`,
            payee: t.conductor_name,
            description: t.description, // Use the existing description from the database
            referenceNumber: t.transaction_id,
            status: t.status, // Include status
            currentDate: currentDate, // Include current date
          })),
      };

      // Return the grouped transactions
      CommonRes.SUCCESS(
        "Transactions categorized by status successfully",
        groupedData,
        resObj,
        res
      );
    } catch (error) {
      CommonRes.SERVER_ERROR(error, resObj, res);
    }
  };

  getScheduledBusesAndConductors = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const resObj: resObj = {
      apiId: "0505",
      action: "GET",
      version: "1.0",
    };

    try {
      // Extract date from query parameters
      const { date } = req.query;

      // Use the current system date if no date is provided
      const currentDate = new Date();
      const formattedDate =
        date && typeof date === "string" ? new Date(date) : currentDate;

      // Fetch the scheduled buses and conductors for the specified date
      const schedules =
        await this.accountsSummaryDAO.getScheduledBusesAndConductors(
          formattedDate
        );

      // Return the response with the fetched data
      CommonRes.SUCCESS(
        "Scheduled buses and conductors retrieved successfully",
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
      apiId: "0505",
      action: "GET",
      version: "1.0",
    };

    try {
      const { conductor_id } = req.params;

      if (!conductor_id) {
        return CommonRes.BAD_REQUEST("Conductor ID is required", resObj, res);
      }

      const transactions = await this.accountsSummaryDAO.transactions(
        conductor_id
      );

      if (transactions.length === 0) {
        return CommonRes.BAD_REQUEST(
          "No transactions found for the conductor on the current date",
          resObj,
          res
        );
      }

      // Extract conductor name from the first transaction
      const conductor_name = transactions[0].conductor_name;

      // Calculate total amount and total transactions
      const totalAmount = transactions.reduce(
        (sum, transaction) => sum + transaction.total_amount,
        0
      );
      const totalTransactions = transactions.length;

      const summary = {
        conductor_name,
        total_amount: totalAmount,
        total_transactions: totalTransactions,
        transactions: transactions.map((tx) => ({
          transaction_id: tx.transaction_id,
          date: tx.date.toISOString().split("T")[0], // Formatting date to YYYY-MM-DD
          time: tx.time,
          description: tx.description,
          transaction_type: tx.transaction_type,
          bus_id: tx.bus_id,
          status: tx.status,
        })),
      };

      CommonRes.SUCCESS(
        "Conductor summary retrieved successfully",
        summary,
        resObj,
        res
      );
    } catch (error) {
      CommonRes.SERVER_ERROR(error, resObj, res);
    }
  };

  // ..................................
  // accountsSummaryController.ts
  getReceiptsByTransactionId = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const resObj = {
      apiId: "0505",
      action: "GET",
      version: "1.0",
    };

    try {
      const { transaction_id } = req.params;

      if (!transaction_id) {
        return CommonRes.BAD_REQUEST("Transaction ID is required", resObj, res);
      }

      const result = await this.accountsSummaryDAO.getReceiptsByTransactionId(
        transaction_id
      );

      if (!result) {
        return CommonRes.BAD_REQUEST(
          "No receipts found for the given transaction ID",
          resObj,
          res
        );
      }

      const summary = {
        conductor_name: result.conductor_name,
        total_amount: result.totalAmount,
        total_receipts: result.totalReceipts,
        receipts: result.receipts.map((receipt: any) => ({
          transaction_id: receipt.transaction_id,
          conductor_id: receipt.conductor_id,
          bus_id: receipt.bus_id,
          receipt_no: receipt.receipt_no,
          amount: receipt.amount,
          payment_type: receipt.payment_type,
          date: receipt.date.toISOString().split("T")[0], // Formatting date to YYYY-MM-DD
        })),
      };

      CommonRes.SUCCESS(
        "Transaction details retrieved successfully",
        summary,
        resObj,
        res
      );
    } catch (error) {
      CommonRes.SERVER_ERROR(error, resObj, res);
    }
  };

  // ............................

  updateTransactionStatus = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const resObj = {
      apiId: "0506",
      action: "PUT",
      version: "1.0",
    };

    try {
      const { transaction_id, status } = req.body;
      console.log(transaction_id, status);
      // Validate input
      if (!transaction_id || typeof status !== "number") {
        return CommonRes.BAD_REQUEST(
          "Transaction ID and status are required",
          resObj,
          res
        );
      }

      // Validate status value
      if (![0, 1, 2, 3].includes(status)) {
        return CommonRes.BAD_REQUEST("Invalid status value", resObj, res);
      }

      // Update the status in the database using DAO
      const updatedTransaction =
        await this.accountsSummaryDAO.updateTransactionStatus(
          transaction_id,
          status
        );

      // Respond with success
      CommonRes.SUCCESS(
        "conductor status updated successfully",
        updatedTransaction,
        resObj,
        res
      );
    } catch (error) {
      CommonRes.SERVER_ERROR(error, resObj, res);
    }
  };

  getAccountsByStatus = async (req: Request, res: Response): Promise<void> => {
    const resObj: resObj = {
      apiId: "0506",
      action: "GET",
      version: "1.0",
    };

    try {
      // Extract status from query parameters
      const { status } = req.query;

      // If status is provided, convert it to an array of numbers; otherwise, default to [0, 1, 2, 3]
      const statusArray = status
        ? (Array.isArray(status) ? status : [status]).map(Number)
        : [0, 1, 2, 3];

      // Fetch accounts based on the given statuses
      const accounts = await this.accountsSummaryDAO.getAccountsByStatus(
        statusArray
      );

      // Return the response with the fetched data
      CommonRes.SUCCESS(
        "Accounts retrieved successfully by status",
        accounts,
        resObj,
        res
      );
    } catch (error) {
      CommonRes.SERVER_ERROR(error, resObj, res);
    }
  };



  // .....................................
  getTotalAmountByConductorId_currentDate = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const resObj: resObj = {
      apiId: "0503",
      action: "GET",
      version: "1.0",
    };

    try {
      // Use the current date
      const currentDate = new Date();

      // Fetch total amount and count for the current date
      const { total_amount, total_count, results } = await this.accountsSummaryDAO.getTotalAmountScheduleConductor();

      CommonRes.SUCCESS(
        "Summary data retrieved successfully",
        { total_amount, total_count, results },
        resObj,
        res
      );
    } catch (error) {
      CommonRes.SERVER_ERROR(error, resObj, res);
    }
  };


};

