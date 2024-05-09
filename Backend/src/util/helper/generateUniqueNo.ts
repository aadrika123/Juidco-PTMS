import { v4 as uuidv4 } from "uuid";

export const generateUnique = (initialString?: string): string => {
  const uniqueId = uuidv4();

  // Extract the first 8 characters from the UUID
  const unqId = uniqueId.substring(0, 6);

  return initialString ? initialString + unqId : unqId;
};
