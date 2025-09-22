import { PrismaClient } from "@prisma/client";
import { generateRes } from "../../../../util/generateRes";

const prisma = new PrismaClient();

class PrimeDashboardDao {
  getDashboardData = async (ulb_id: number) => {

    const currentDate = new Date()

    const currentFinancialYearStart = currentDate.getMonth() < 3
      ? new Date(currentDate.getFullYear() - 1, 3, 1) // April 1st of the previous year
      : new Date(currentDate.getFullYear(), 3, 1);    // April 1st of the current year

    const currentFinancialYearEnd = currentDate.getMonth() < 3
      ? new Date(currentDate.getFullYear(), 2, 31)    // March 31st of the current year
      : new Date(currentDate.getFullYear() + 1, 2, 31); // March 31st of the next year

    const totalAmountOfTheDay = await prisma.receipts.aggregate({
      where: {
        date: currentDate,
        ulb_id: ulb_id
      },
      _sum: {
        amount: true
      }
    })

    const currentFinancialYearTotalAmount = await prisma.receipts.aggregate({
      where: {
        date: {
          gte: currentFinancialYearStart,
          lte: currentFinancialYearEnd,
        },
        ulb_id: ulb_id
      },
      _sum: {
        amount: true
      }
    })

    const currentFinancialYearTotalBillCut = await prisma.receipts.aggregate({
      where: {
        date: {
          gte: currentFinancialYearStart,
          lte: currentFinancialYearEnd,
        },
        ulb_id: ulb_id
      },
      _count: true
    })

    const currentFinancialYearTotalScheduledConductor = await prisma.scheduler.aggregate({
      where: {
        date: {
          gte: currentFinancialYearStart,
          lte: currentFinancialYearEnd,
        }
      },
      _count: true
    })

    const dataToSend = {
      total_amount_of_the_day: totalAmountOfTheDay?._sum?.amount,
      financial_year_total_amount: currentFinancialYearTotalAmount._sum?.amount,
      financial_year_total_bill_cut: currentFinancialYearTotalBillCut._count,
      financial_year_total_scheduled_conductor: currentFinancialYearTotalScheduledConductor._count
    }

    return generateRes(dataToSend);
  };


}

export default PrimeDashboardDao;
