import { Response } from "express";

export type resObj = {
  action: string;
  apiId: string;
  version: string;
};

export interface ApiResponse {
  json: any;
  responseCode: number;
  res: Response;
  status?: boolean | true;
}
