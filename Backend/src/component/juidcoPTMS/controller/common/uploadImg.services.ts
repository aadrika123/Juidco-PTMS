import { Request, Response, NextFunction } from "express";
import CommonRes from "../../../../util/helper/commonResponse";
import { resMessage } from "../../../../util/common";
import { resObj } from "../../../../util/types";
import { imageUploaderV2 } from "../../../../util/imageUploaderV2";

export class UploadImgServices {
  constructor() {}

  imageUpload = async (
    req: Request,
    res: Response,
    next: NextFunction,
    apiId: string
  ) => {
    try {
      const imageData = req.file;

      if (!imageData) {
        return CommonRes.SERVER_ERROR(
          resMessage("No file uploaded"),
          {
            apiId,
            action: "UPLOAD",
            version: "1.0",
          },
          res
        );
      }

      const resObj: resObj = {
        apiId,
        action: "UPLOAD", 
        version: "1.0",
      };

      console.log(req.file, "file============>img folder");

      const data = {
        originalname: imageData.originalname,
        mimetype: imageData.mimetype,
        buffer: imageData.buffer,
        size: String(imageData.size),
      };

      console.log(data, "data =====>>");

      const uploadedImageUrls = await imageUploaderV2([data]); 
      console.log("uploadedImageUrls",uploadedImageUrls)

      if (!uploadedImageUrls || uploadedImageUrls.length === 0) {
        return CommonRes.SERVER_ERROR(
          resMessage("Image upload failed"),
          resObj,
          res
        );
      }

      const imageUrl = uploadedImageUrls[0];
      return CommonRes.SUCCESS(
        resMessage("Image uploaded successfully").FOUND,
        { imageUrl },
        resObj,
        res
      );
    } catch (err) {
      console.error("Error uploading image:", err);
      return CommonRes.SERVER_ERROR(
        resMessage("Error uploading image"),
        {
          apiId,
          action: "UPLOAD",
          version: "1.0",
        },
        res
      );
    }
  };
}
