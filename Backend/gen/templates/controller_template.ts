/**
 * | Author- Krish
 * | Created for- Employee OnBoarding
 * | Status: open
 */

import { NextFunction, Request, Response } from "express";
import EmployeeOnBoardDao from "../dao/empOnBoard.dao";
import { resObj } from "../../../util/types";
import // employeeBasicDetailsSchema,

"../requests/ems/emp_pers_details.validation";
import CommonRes from "../../../util/helper/commonResponse";
import { resMessage } from "../../../util/common";

class Controller {
  private employeeOnBoardDao: EmployeeOnBoardDao;
  private initMesg: string;
  private filterReqBody(body: any[]) {
    if (body.length === 0) {
      return body;
    }
    const lastObj = body[body.length - 1];
    if (Object.keys(lastObj).length === 0 && lastObj.constructor === Object) {
      body.pop();
    }
    return body;
  }

  constructor() {
    this.employeeOnBoardDao = new EmployeeOnBoardDao();
    this.initMesg = "Employee OnBoard";
  }

  // Create
  create = async (
    req: Request,
    res: Response,
    next: NextFunction,
    apiId: string
  ): Promise<object> => {
    const resObj: resObj = {
      apiId,
      action: "POST",
      version: "1.0",
    };

    try {
      const data = await this.employeeOnBoardDao.store(req);

      return CommonRes.CREATED(
        resMessage(this.initMesg).CREATED,
        data,
        resObj,
        res,
        next
      );
    } catch (error: any) {
      // console.log(error);
      // logger.error("failed");

      return CommonRes.SERVER_ERROR(error, resObj, res, next);
    }
  };
}

export default Controller;
