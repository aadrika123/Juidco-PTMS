import type { ReceiptType } from "../../../../util/types/receipt/receipt.type";
import * as Yup from "yup";

export const receiptValidatorData = (receipt: ReceiptType): ReceiptType => {
  return {
    receipt_no: receipt.receipt_no,
    amount: receipt.amount,
    date: receipt.date,
<<<<<<< HEAD
    conductor_id: receipt.conductor_id,
    rc: receipt.rc,
    time: receipt.time,
    conductor: receipt.conductor,
=======
    time: receipt.time,
    conductor: receipt.conductor,
    vehicle: receipt.vehicle,
>>>>>>> origin/main
  };
};

export const receiptValidationSchema = Yup.object({
  receipt_no: Yup.string().required(),
  amount: Yup.number().required(),
  date: Yup.date().required(),
<<<<<<< HEAD
  conductor_id: Yup.string().required(),
  rc_no: Yup.string().required(),
  time: Yup.string().required(),
=======
  time: Yup.string().required(),
  conductor: Yup.string().required(),
  vehicle: Yup.string().required(),
>>>>>>> origin/main
});
