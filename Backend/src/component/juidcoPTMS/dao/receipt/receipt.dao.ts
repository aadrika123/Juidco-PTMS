import { Request } from "express";
import { Prisma, PrismaClient } from "@prisma/client";
import { generateRes } from "../../../../util/generateRes";
import { generateReceiptNumber } from "../../../../util/helper/generateUniqueNo";
import { addMethod } from "yup";

const prisma = new PrismaClient();

export const genrateDate = () => {};
class ReceiptDao {
  post = async (req: Request) => {
    console.log("before creating");
    console.log(req.body.data, "req.body.data");

    // const time = Number(req.body.data.time);
    //const date = new Date(`${req.body.data.date}T10:19:58.523Z`);
    const date = new Date(req.body.data.date);

    // const scheduleRecord = await prisma.$queryRawUnsafe<any[]>(`
    // select * from scheduler where conductor_id=${req.body.data.conductor_id}
    // and from_time <= ${time} and to_time>= ${time}
    // and date::date = '${req.body.data.date}'`);

    // console.log(scheduleRecord, "rec");

    // if (scheduleRecord.length <= 0) return;

    const data = await prisma.receipts.create({
      data: {
        amount: req.body.data.amount,
        bus_id: req.body.data.bus_id,
        // bus: { connect: { register_no: scheduleRecord[0].bus_id } },
        date: date,
        conductor_id: req.body.data.conductor_id,
        time: req.body.data.time,
        receipt_no: req.body.data.receipt_no,
        // conductor: { connect: { cunique_id: req.body.data.conductor_id } },
      },
    });
    console.log(data, "after creating");

    const receipt_no = generateReceiptNumber(data.id);
    const dataWithReceiptNo = await prisma.receipts.update({
      where: { id: data.id },
      data: { receipt_no },
    });

    return generateRes(dataWithReceiptNo);
  };

  // ======================== GET RECEIPTS =========================================//
  get = async (req: Request) => {
    const { from_date, to_date } = req.body;
    const page: number = Number(req.query.page);
    const limit: number = Number(req.query.limit);
    const search: string = String(req.query.search);

    console.log(search, new Date(from_date), to_date, "datee");

    const query: Prisma.receiptsFindManyArgs = {
      skip: (page - 1) * limit,
      take: limit,
      select: {
        amount: true,
        bus: true,
        date: true,
        conductor: true,
        time: true,
        receipt_no: true,
      },
    };

    if (search !== "" && typeof search === "string" && search !== "undefined") {
      query.where = {
        OR: [
          {
            bus: {
              register_no: { contains: search, mode: "insensitive" },
            },
          },

          {
            bus: {
              vin_no: { contains: search, mode: "insensitive" },
            },
          },
        ],
      };
    }

    if (
      from_date !== "" &&
      from_date !== undefined &&
      to_date !== "" &&
      to_date !== undefined
    ) {
      const d1 = new Date(from_date);
      const d2 = new Date(to_date);
      query.where = {
        OR: [
          {
            date: {
              gte: d1,
              lte: d2,
            },
          },
        ],
      };
    }

    const [data, count] = await prisma.$transaction([
      prisma.receipts.findMany(query),
      prisma.receipts.count(),
    ]);
    return generateRes({ data, count, page, limit });
  };
  // ======================== GET RECEIPTS =========================================//

  getReceiptTotalAmnt = async (req: Request) => {
    const { from_date, to_date } = req.body;

    // ------------ CONDUCTOR COLLECTED --------------------//
    const query: Prisma.receiptsGroupByArgs = {
      by: "date",
      _sum: { amount: true },
    };

    // const data = await prisma.receipts.groupBy(query);
    // ------------ BUS COLLECTED --------------------//
  };
}

export default ReceiptDao;
