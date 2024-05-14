import type { ReceiptType } from "../../../../util/types/receipt/receipt.type";
import * as Yup from "yup";

export const receiptValidatorData = (receipt: ReceiptType): ReceiptType => {
  return {
    receipt_no: receipt.receipt_no,
    amount: receipt.amount,
    date: receipt.date,
    conductor_id: receipt.conductor_id,
    rc_no: receipt.rc_no,
  };
};

export const receiptValidationSchema = Yup.object({
  receipt_no: Yup.string().required(),
  amount: Yup.number().required(),
  date: Yup.date().required(),
  conductor_id: Yup.string().required(),
  rc_no: Yup.string().required(),
});
