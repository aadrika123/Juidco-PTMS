export type ReceiptType = {
  id?: number;
  receipt_no: string;
  amount: number;
  date: Date;
  time: string;
  conductor: string;
  vehicle: string;
};
