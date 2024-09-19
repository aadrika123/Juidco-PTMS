// import { Request } from 'express';

import { PrismaClient } from '@prisma/client';
import { string } from 'yup';


const prisma = new PrismaClient();

export default class AccountsSummaryDAO {
  // get api totoal amount
  async getTotalAmount(
    conductor_id: string,
    date: Date
  ): Promise<{ total_amount: number }> {
    const result = await prisma.receipts.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        conductor_id: conductor_id,
        date: date,
        isvalidated: false,
      },
    });

    console.log(result);

    return { total_amount: result._sum.amount || 0 };
  }

  //post
  async createSummary(summaryData: {
    transaction_id: string;
    conductor_id: string;
    total_amount: number;
    date: Date;
    time: string;
    description: string;
    transaction_type: string;
    conductor_name: string;
    bus_id: string;
    status: number;
  }): Promise<any> {
    const receiptData = await prisma.accounts_summary.create({
      data: summaryData,
    });

    await prisma.receipts.updateMany({
      where: {
        conductor_id: summaryData.conductor_id,
        date: summaryData.date,
      },
      data: {
        isvalidated: true,
      },
    });

    await prisma.receipts.updateMany({
      where: {
        conductor_id: summaryData.conductor_id,
        date: summaryData.date,
        transaction_id: null,
        isvalidated: true,
      },
      data: {
        transaction_id: summaryData?.transaction_id,
      },
    });

    return receiptData;
  }

  async getName(conductor_id: string): Promise<{ name: string }> {
    const result = await prisma.conductor_master.findFirst({
      where: {
        cunique_id: conductor_id,
      },
      select: {
        first_name: true,
        middle_name: true,
        last_name: true,
      },
    });

    if (!result) {
      return { name: "" };
    }

    const fullName = result.middle_name
      ? `${result.first_name} ${result.middle_name} ${result.last_name}`.trim()
      : `${result.first_name} ${result.last_name}`.trim();

    return { name: fullName };
  }

  async getbus_id(conductor_id: string): Promise<{ bus_id: string }> {
    const result = await prisma.receipts.findFirst({
      where: {
        conductor_id: conductor_id,
      },
      select: {
        bus_id: true,
      },
    });

    if (!result || !result.bus_id) {
      return { bus_id: "" };
    }

    return { bus_id: result.bus_id };
  }

  async getTotalAmountByConductorId(
    conductor_id: string,
    systemDate: Date
  ): Promise<any> {
    return prisma.receipts.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        conductor_id: conductor_id,
        // bus_id: bus_id,
        date: systemDate,
      },
    });
  }

  // DAO method to get all transactions with status 0 (Not Validated)
  // DAO method to get transactions by multiple statuses
  // async getUnvalidatedTransactions(statuses: number[]): Promise<any[]> {
  //     return prisma.accounts_summary.findMany({
  //         where: {
  //             status: {
  //                 in: statuses,  // Get transactions where status is in the array [0, 1, 2, 3]
  //             },
  //         },
  //     });
  // }

  async getUnvalidatedTransactions(statuses: number[]): Promise<any[]> {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0)); // Start of today
    const endOfDay = new Date(today.setHours(23, 59, 59, 999)); // End of today

    return prisma.accounts_summary.findMany({
      where: {
        status: {
          in: statuses, // Get transactions where status is in the array [0, 1, 2, 3]
        },
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      select: {
        conductor_id: true,
        date: true,
        time: true,
        total_amount: true,
        conductor_name: true,
        description: true,
        transaction_id: true,
        status: true,
      },
    });
  }

  // DAO method to get scheduled buses and conductors for a specific date
  async getScheduledBusesAndConductors(date: Date): Promise<any[]> {
    return prisma.$queryRaw`
        SELECT s.conductor_id, s.bus_id, s.from_time, s.to_time,
               cm.first_name || ' ' || COALESCE(cm.middle_name || ' ', '') || cm.last_name AS conductor_name,
               cm.mobile_no
        FROM public.scheduler s
        JOIN conductor_master cm ON s.conductor_id = cm.cunique_id
        WHERE s.date::date = ${date.toISOString().split("T")[0]}::date;
    `;
  }

  async transactions(conductor_id: string): Promise<any[]> {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0)); // Start of today
    const endOfDay = new Date(today.setHours(23, 59, 59, 999)); // End of today

    return prisma.accounts_summary.findMany({
      where: {
        conductor_id,
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      orderBy: { created_at: "desc" },
    });
  }

  // .......................................
  // accountsSummaryDAO.ts
  async getReceiptsByTransactionId(transaction_id: string): Promise<any> {
    const receipts = await prisma.receipts.findMany({
      where: {
        transaction_id,
      },
      include: {
        conductor: true, // Include conductor details
        bus: true, // Include bus details
      },
      orderBy: { created_at: "desc" },
    });

    if (receipts.length === 0) {
      return null; // No receipts found for the given transaction_id
    }

    // Calculate total amount and total number of receipts
    const totalAmount = receipts.reduce(
      (sum, receipt) => sum + receipt.amount,
      0
    );
    const totalReceipts = receipts.length;

    return {
      totalAmount,
      totalReceipts,
      conductor_name: `${receipts[0].conductor.first_name} ${receipts[0].conductor.last_name}`,
      receipts: receipts.map((receipt) => ({
        transaction_id: receipt.transaction_id,
        conductor_id: receipt.conductor_id,
        bus_id: receipt.bus_id,
        receipt_no: receipt.receipt_no,
        amount: receipt.amount,
        payment_type: receipt.payment_type,
        date: receipt.date,
      })),
    };
  }

  // ................................

  async updateTransactionStatus(
      transaction_id: string,
    status: number
  ): Promise<any> {
    try {
      const updatedTransaction = await prisma.accounts_summary.updateMany({
          where: { transaction_id },
        data: { status },
      });

      return updatedTransaction;
    } catch (error) {
      // Handle or log error as needed
      throw new Error("Failed to update transaction status");
    }
  }

  async getAccountsByStatus(statuses: number[]): Promise<any[]> {
    return prisma.accounts_summary.findMany({
      where: {
        status: {
          in: statuses, // Filter by multiple statuses
        },
      },
    });
  }
}
