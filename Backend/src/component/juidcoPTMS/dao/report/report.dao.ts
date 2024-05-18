import { Request } from "express";
import { Prisma, PrismaClient } from "@prisma/client";
import { generateRes } from "../../../../util/generateRes";

const prisma = new PrismaClient();
class ReportDao {
  generateReport = async (req: Request) => {
    const { conductor_id, bus_id, from_date, to_date } = req.body;
    let amounts: any = [];

    console.log(conductor_id);
    const query: Prisma.receiptsFindManyArgs = {
      select: {
        id: true,
        amount: true,
        bus: {
          select: {
            id: true,
            register_no: true,
            vin_no: true,
          },
        },
        conductor: {
          select: {
            first_name: true,
            middle_name: true,
            last_name: true,
            age: true,
            blood_grp: true,
            mobile_no: true,
            emergency_mob_no: true,
            email_id: true,
            cunique_id: true,
            adhar_no: true,
          },
        },
        date: true,
      },
    };

    if (conductor_id) {
      query.where = {
        OR: [
          {
            conductor_id: conductor_id,
          },
        ],
      };

      amounts = await prisma.$queryRawUnsafe(`
        select conductor_id,amount::INT, count(amount)::INT, sum(amount)::INT,date::DATE from receipts group by conductor_id, amount, date
      `);
    }

    if (bus_id) {
      query.where = {
        OR: [
          {
            bus_id: bus_id,
          },
        ],
      };

      amounts = await prisma.$queryRawUnsafe(`
      select bus_id,amount::INT, count(amount)::INT, sum(amount)::INT,date::DATE from receipts group by bus_id, amount, date
      `);
    }

    // ======================== BY CONDUCTOR ================================//
    if (from_date && conductor_id) {
      query.where = {
        OR: [
          {
            date: new Date(from_date),
          },
        ],
      };

      amounts = await prisma.$queryRawUnsafe(`
        select conductor_id,amount::INT, count(amount)::INT, sum(amount)::INT,date::DATE from receipts group by conductor_id, amount, date
        having date = '${from_date}'`);
    }

    if (from_date && to_date && conductor_id) {
      query.where = {
        OR: [
          {
            date: {
              gte: new Date(from_date),
              lte: new Date(to_date),
            },
          },
        ],
      };
    }
    // ======================== BY CONDUCTOR ================================//

    // ======================== BY BUS================================//
    if (from_date && bus_id) {
      query.where = {
        OR: [
          {
            date: new Date(from_date),
          },
        ],
      };

      amounts = await prisma.$queryRawUnsafe(`
      select bus_id,amount::INT, count(amount)::INT, sum(amount)::INT,date::DATE from receipts group by bus_id, amount, date
      having date = '${from_date}'`);
    }

    if (from_date && to_date && bus_id) {
      query.where = {
        OR: [
          {
            date: {
              gte: new Date(from_date),
              lte: new Date(to_date),
            },
          },
        ],
      };
      amounts = await prisma.$queryRawUnsafe(`
      select bus_id,amount::INT, count(amount)::INT, sum(amount)::INT,date::DATE from receipts group by bus_id, amount, date
      having date between '${from_date}' AND '${to_date}' ORDER BY date ASC`);
    }
    // ======================== BY BUS================================//

    const [data] = await prisma.$transaction([prisma.receipts.findMany(query)]);

    const result = {
      data: [...data],
      amounts,
    };
    return generateRes({ result });
  };

  getTotalAmount = async (req: Request) => {
    const { bus_id, conductor_id } = req.body;

    const byConductor = await prisma.receipts.groupBy({
      by: "conductor_id",
      _sum: { amount: true },
      orderBy: { conductor_id: "asc" },
    });

    const byBus = await prisma.receipts.groupBy({
      by: "bus_id",
      _sum: { amount: true },
      orderBy: { bus_id: "asc" },
    });

    if (bus_id) {
      return generateRes(byBus);
    } else if (conductor_id) {
      return generateRes(byConductor);
    }
  };
}

export default ReportDao;
