import { Request } from "express";
import { receiptValidatorData } from "../../validators/receipt/receipt.validator";
import { PrismaClient } from "@prisma/client";
import { generateRes } from "../../../../util/generateRes";
import { generateReceiptNumber } from "../../../../util/helper/generateUniqueNo";

const prisma = new PrismaClient();
class ReceiptDao {
  get = async (req: Request) => {
    const data = await prisma.$queryRaw`select * from receipt`;
    return data;
  };

  post = async (req: Request) => {
    // const body = receiptValidatorData(req.body.data);
    const data = await prisma.receipt.create({ data: req.body.data });
    const receipt_no = generateReceiptNumber(data.id);
    const dataWithReceiptNo = await prisma.receipt.update({
      where: { id: data.id },
      data: { receipt_no },
    });

    return generateRes(dataWithReceiptNo);
  };
}

export default ReceiptDao;
