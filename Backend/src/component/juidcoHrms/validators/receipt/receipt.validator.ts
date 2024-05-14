import type { ReceiptType } from "../../../../util/types/receipt/receipt.type";
import * as Yup from "yup";

export const receiptValidatorData = (receipt: ReceiptType): ReceiptType => {
  return {
    receipt_no: receipt.receipt_no,
    amount: receipt.amount,
    date: receipt.date,
    time: receipt.time,
    conductor: receipt.conductor,
    vehicle: receipt.vehicle,
  };
};

export const receiptValidationSchema = Yup.object({
  receipt_no: Yup.string().required(),
  amount: Yup.number().required(),
  date: Yup.date().required(),
  time: Yup.string().required(),
  conductor: Yup.string().required(),
  vehicle: Yup.string().required(),
});
