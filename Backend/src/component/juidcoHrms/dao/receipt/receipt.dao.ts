import { Request } from "express";
import { receiptRequestData } from "../../requests/receipt/receipt.request";
import { PrismaClient } from "@prisma/client";
import { generateRes } from "../../../../util/generateRes";

const prisma = new PrismaClient();
class ReceiptDao {
  post = async (req: Request) => {
    const body = receiptRequestData(req.body.data);
    const data = await prisma.receipt.create({ data: body });
    return generateRes(data);
  };
}

export default ReceiptDao;
