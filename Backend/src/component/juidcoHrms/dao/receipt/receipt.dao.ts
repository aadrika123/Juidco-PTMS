import { Request } from "express";
import { receiptValidatorData } from "../../validators/receipt/receipt.validator";
import { PrismaClient } from "@prisma/client";
import { generateRes } from "../../../../util/generateRes";

const prisma = new PrismaClient();
class ReceiptDao {
  get = async (req: Request) => {
    const data = await prisma.$queryRaw`select * from receipt`;
    return data;
  };

  post = async (req: Request) => {
    const body = receiptValidatorData(req.body.data);
    const data = await prisma.receipt.create({ data: body });
    return generateRes(data);
  };
}

export default ReceiptDao;
