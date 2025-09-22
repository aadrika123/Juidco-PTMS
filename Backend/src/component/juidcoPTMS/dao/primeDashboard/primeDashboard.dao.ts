import { PrismaClient } from "@prisma/client";
import { generateRes } from "../../../../util/generateRes";

const prisma = new PrismaClient();

class PrimeDashboardDao {
  getDashboardData = async (ulb_id?: number) => {
    const currentDate = new Date();

    const currentFinancialYearStart =
      currentDate.getMonth() < 3
        ? new Date(currentDate.getFullYear() - 1, 3, 1) // April 1st of prev year
        : new Date(currentDate.getFullYear(), 3, 1); // April 1st of current year

    const currentFinancialYearEnd =
      currentDate.getMonth() < 3
        ? new Date(currentDate.getFullYear(), 2, 31) // March 31st of current year
        : new Date(currentDate.getFullYear() + 1, 2, 31); // March 31st of next year

    // Build condition dynamically
    const ulbCondition = ulb_id ? { ulb_id } : {};

    const totalAmountOfTheDay = await prisma.receipts.aggregate({
      where: {
        ...ulbCondition,
        date: {
          gte: new Date(currentDate.setHours(0, 0, 0, 0)),
          lte: new Date(currentDate.setHours(23, 59, 59, 999)),
        },
      },
      _sum: { amount: true },
    });

    const currentFinancialYearTotalAmount = await prisma.receipts.aggregate({
      where: {
        ...ulbCondition,
        date: {
          gte: currentFinancialYearStart,
          lte: currentFinancialYearEnd,
        },
      },
      _sum: { amount: true },
    });

    const currentFinancialYearTotalBillCut = await prisma.receipts.aggregate({
      where: {
        ...ulbCondition,
        date: {
          gte: currentFinancialYearStart,
          lte: currentFinancialYearEnd,
        },
      },
      _count: true,
    });

    const currentFinancialYearTotalScheduledConductor = await prisma.scheduler.aggregate({
      where: {
        ...ulbCondition,
        date: {
          gte: currentFinancialYearStart,
          lte: currentFinancialYearEnd,
        },
      },
      _count: true,
    });

    const dataToSend = {
      total_amount_of_the_day: totalAmountOfTheDay._sum?.amount || 0,
      financial_year_total_amount: currentFinancialYearTotalAmount._sum?.amount || 0,
      financial_year_total_bill_cut: currentFinancialYearTotalBillCut._count || 0,
      financial_year_total_scheduled_conductor:
        currentFinancialYearTotalScheduledConductor._count || 0,
    };

    return generateRes(dataToSend);
  };
}

export default PrimeDashboardDao;
