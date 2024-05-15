import { v4 as uuidv4 } from "uuid";

export const generateUnique = (initialString?: string): string => {
  const uniqueId = uuidv4();
  console.log(uniqueId, "uniqueIdfucntion res=========>>");

  // Extract the first 8 characters from the UUID
  const unqId = uniqueId.substring(0, 6);

  return initialString ? initialString + unqId : unqId;
};

export const generateReceiptNumber = (id: any) => {
  let increementNumber = 50000;
  const fixedDigits = "T00";

  increementNumber = increementNumber + Number(id);
  let receiptNumber = fixedDigits + increementNumber;

  return receiptNumber;
};

export default function generateUniqueId(unique: any) {
  const length = 8;
  const possibleDigits = "0123456789"; // All possible digits

  for (let i = 0; i < length; i++) {
    // Select a random digit from possibleDigits and append it to the id
    unique += possibleDigits.charAt(
      Math.floor(Math.random() * possibleDigits.length)
    );
  }

  return unique;
}
