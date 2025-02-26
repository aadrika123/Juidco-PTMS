import { Request, Response, NextFunction } from "express";

export const responseTime = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.log("responsetime called===>");
  const startTime = Date.now();
  res.on("finish", () => {
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    res.locals.responseTime = responseTime;
  });
  next();
};
