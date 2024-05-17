import { Request, Response, NextFunction } from "express";
import CommonRes from "../../../../util/helper/commonResponse";
import { resMessage } from "../../../../util/common";
import { resObj } from "../../../../util/types";

export class UploadImgServices {
  // public prisma = new PrismaClient();
  constructor() {}

  imageUpload = async (
    req: Request,
    res: Response,
    next: NextFunction,
    apiId: string
  ) => {
    const imageData = req.file;
    const resObj: resObj = {
      apiId,
      action: "GET",
      version: "1.0",
    };

    console.log(req.file, "file============>img folder");

    const data = {
      name: imageData?.originalname,
      mimeType: imageData?.mimetype,
      buffer: imageData?.buffer,
      size: String(imageData?.size),
    };

    console.log(data, "data =====>>");
    return CommonRes.SUCCESS(
      resMessage("Image uploaded successfully").FOUND,
      data,
      resObj,
      res,
      next
    );
  };
}
