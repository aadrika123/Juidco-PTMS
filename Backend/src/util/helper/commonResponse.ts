import { Response } from "express";
import { sendResponse } from "../sendResponse";
import { resObj } from "../types";

const CommonRes = Object.freeze({
  VALIDATION_ERROR: (
    error: any,
    resObj: resObj,
    res: Response
  ): Promise<object> => {
    return sendResponse(
      false,
      error,
      "",
      404,
      resObj.action,
      resObj.apiId,
      resObj.version,
      res
    );
  },
  SERVER_ERROR: (
    error: any,
    resObj: resObj,
    res: Response
  ): Promise<object> => {
    return sendResponse(
      false,
      error,
      "",
      400,
      resObj.action,
      resObj.apiId,
      resObj.version,
      res
    );
  },
  CREATED: (
    message: any,
    data: unknown,
    resObj: resObj,
    res: Response
  ): Promise<object> => {
    return sendResponse(
      true,
      message,
      data,
      200,
      resObj.action,
      resObj.apiId,
      resObj.version,
      res
    );
  },
  SUCCESS: (
    message: any,
    data: unknown,
    resObj: resObj,
    res: Response
  ): Promise<object> => {
    return sendResponse(
      true,
      message,
      data,
      200,
      resObj.action,
      resObj.apiId,
      resObj.version,
      res
    );
  },

  NOT_FOUND: (
    message: any,
    data: unknown,
    resObj: resObj,
    res: Response
  ): Promise<object> => {
    return sendResponse(
      true,
      message,
      data,
      400,
      resObj.action,
      resObj.apiId,
      resObj.version,
      res
    );
  },

  UNAUTHORISED: (
    error: any,
    resObj: resObj,
    res: Response
  ): Promise<object> => {
    return sendResponse(
      false,
      error,
      "",
      404,
      resObj.action,
      resObj.apiId,
      resObj.version,
      res
    );
  },

  DEFAULT: "The underlying {kind} for model {model} does not exist.",
});

export default CommonRes;
