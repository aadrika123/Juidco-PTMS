import express from "express";
import ReceiptRoute from "./route/receipt/receipt.route";

/*
|--------------------------------------------------------------------------
| API Routes
| Author- Krish
| Created On- 14-02-2024 
| Created for- juidco_hrms
| Module status- Open
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application.
|
*/
/**
 * | Comman Route for finance
 */

class PtmsRoute {
  private receiptRoute: ReceiptRoute;

  constructor(app: express.Application) {
    this.receiptRoute = new ReceiptRoute();
    this.receiptRoute.configure(app); // 01
  }
}

export default PtmsRoute;
