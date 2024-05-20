"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const receipt_validator_1 = require("../../validators/receipt/receipt.validator");
const client_1 = require("@prisma/client");
const generateRes_1 = require("../../../../util/generateRes");
const prisma = new client_1.PrismaClient();
class ReceiptDao {
    get = async (req) => {
        const data = await prisma.$queryRaw `select * from receipt`;
        return data;
    };
    post = async (req) => {
        const body = (0, receipt_validator_1.receiptValidatorData)(req.body.data);
        const data = await prisma.receipt.create({ data: body });
        return (0, generateRes_1.generateRes)(data);
    };
}
exports.default = ReceiptDao;
