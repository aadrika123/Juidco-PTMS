import { Request } from "express";
import { PrismaClient } from "@prisma/client";
import { generateRes } from "../../../../util/generateRes";
import { generateReceiptNumber } from "../../../../util/helper/generateUniqueNo";

const prisma = new PrismaClient();

export const genrateDate = () => {};
class ReceiptDao {
  get = async () => {
    const data = await prisma.$queryRaw`select * from receipts`;
    return data;
  };

  post = async (req: Request) => {
    // const body = receiptValidatorData(req.body.data);
    console.log("before creating");
    console.log(req.body.data, "req.body.data");

    const time = Number(req.body.data.time);
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
}

export default ReceiptDao;
