import { Request } from "express";
import { PrismaClient } from "@prisma/client";
import { generateRes } from "../../../../util/generateRes";

const prisma = new PrismaClient();
class ReportDao {
  generateReport = async (req: Request) => {
    const { conductor_id, bus_id, from_date, to_date } = req.body;
    let amounts: any = [];
    let query: string = "";
    const conductor: string = ", receipts.conductor_id ";

    function query_fn(extend_query: string, conductor?: string): string {
      return `
        select bus_id, sum(amount)::INT as total_collection ,date, bm.status ${
          conductor || ""
        } from receipts 
        LEFT JOIN bus_master as bm ON receipts.bus_id = bm.register_no
        LEFT JOIN conductor_master as cm ON receipts.conductor_id = cm.cunique_id
        ${extend_query} group by bus_id, date, bm.status ${
        conductor || ""
      } order by date ASC
      `;
    }

    query = query_fn("");

    if (conductor_id) {
      const query_extend = `where receipts.conductor_id = '${conductor_id}' `;
      query = query_fn(query_extend, conductor);

      amounts = await prisma.$queryRawUnsafe(`
        select bus_id, conductor_id,amount::INT, count(amount)::INT, sum(amount)::INT,date::DATE from receipts 
        group by bus_id, conductor_id, amount, date
      `);
    }

    if (bus_id) {
      const query_extend = `where receipts.bus_id = '${bus_id}' `;
      query = query_fn(query_extend);

      amounts = await prisma.$queryRawUnsafe(`
        select bus_id,amount::INT, count(amount)::INT, sum(amount)::INT,date::DATE from receipts 
        where bus_id = '${bus_id}'
        group by bus_id, amount, date
      `);
    }

    // ======================== BY CONDUCTOR ================================//
    if (from_date && conductor_id) {
      const query_extend = `where receipts.conductor_id = '${conductor_id}' AND date::text = '${from_date}'`;
      query = query_fn(query_extend, conductor);

      amounts = await prisma.$queryRawUnsafe(`
        select bus_id, conductor_id,amount::INT, count(amount)::INT, sum(amount)::INT,date::DATE from receipts 
        group by conductor_id, amount, date, bus_id
        having date = '${from_date}'`);
    }

    if (from_date && to_date && conductor_id) {
      const query_extend = `where date::text between '${from_date}' and '${to_date}'
                            AND receipts.conductor_id = '${conductor_id}'`;
      query = query_fn(query_extend, conductor);

      amounts = await prisma.$queryRawUnsafe(`
        select bus_id,amount::INT, count(amount)::INT, sum(amount)::INT,date::DATE from receipts
        WHERE conductor_id = '${conductor_id}' AND date BETWEEN '${from_date}' AND '${to_date}'
        group by bus_id, amount, date
        ORDER BY date ASC`);
    }
    // ======================== BY CONDUCTOR ================================//

    // ======================== BY BUS================================//
    if (from_date && bus_id) {
      const query_extend = `where receipts.bus_id = '${bus_id}' AND date::text = '${from_date}'`;
      query = query_fn(query_extend);

      amounts = await prisma.$queryRawUnsafe(`
        select bus_id,amount::INT, count(amount)::INT, sum(amount)::INT,date::DATE from receipts 
        where bus_id = '${bus_id}'
        group by bus_id, amount, date
        having date = '${from_date}'`);
    }

    if (from_date && to_date && bus_id) {
      const query_extend = `where date::text between '${from_date}' and '${to_date}'
                            AND receipts.bus_id = '${bus_id}'`;
      query = query_fn(query_extend);
      amounts = await prisma.$queryRawUnsafe(`
        select bus_id,amount::INT, count(amount)::INT, sum(amount)::INT,date::DATE from receipts
        WHERE bus_id = '${bus_id}' AND date BETWEEN '${from_date}' AND '${to_date}'
        group by bus_id, amount, date
        ORDER BY date ASC`);
    }
    // ======================== BY BUS================================//

    const [data] = await prisma.$transaction([
      prisma.$queryRawUnsafe<any[]>(`${query}`),
    ]);

    console.log(data);

    const result = {
      data: [...data],
      amounts,
    };
    return generateRes({ result });
  };

  getTotalAmount = async (req: Request) => {
    const { bus_id, conductor_id, from_date, to_date, curr_date } = req.body;
    let query: string = "";
    function query_fn(extend_query: string): string {
      return `
        select sum(amount)::INT as total_bus_collection from receipts ${extend_query}
      `;
    }

    query = query_fn("");

    //   ------------------------- FILTER BY BUS -----------------------------//
    if (bus_id) {
      query = query_fn(`where bus_id = '${bus_id}'`);
    }

    if (bus_id && from_date) {
      query = query_fn(`WHERE bus_id = '${bus_id}' AND date = '${from_date}'`);
    }
    if (bus_id && from_date && to_date) {
      query = query_fn(
        `where bus_id = '${bus_id}' AND date BETWEEN '${from_date}' AND '${to_date}'`
      );
    }
    //   ------------------------- FILTER BY BUS -----------------------------//

    //   ------------------------- FILTER BY CONDUCTOR-----------------------------//
    if (conductor_id) {
      query = query_fn(`where conductor_id = '${conductor_id}'`);
    }
    if (conductor_id && from_date) {
      query = query_fn(
        ` where conductor_id = '${conductor_id}' AND date = '${from_date}'`
      );
    }
    if (conductor_id && from_date && to_date) {
      query = query_fn(
        `where conductor_id = '${conductor_id}' AND date BETWEEN '${from_date}' AND '${to_date}'`
      );
    }
    //   ------------------------- FILTER BY CONDUCTOR-----------------------------//

    //   ------------------------- FILTER BY CURRENT_DATE TOTAL COLLECTION-----------------------------//
    if (curr_date) {
      query = query_fn(`where date = '${curr_date}'`);
    }
    //   ------------------------- FILTER BY CURRENT_DATE TOTAL COLLECTION-----------------------------//
    const data = await prisma.$queryRawUnsafe(`${query}`);

    return generateRes(data);
  };

  //   ------------------------- GET REAL-TIME COLLECTION ----------------------------//

  getRealTimeCollection = async () => {
    const date = new Date().toISOString().split("T")[0];
    const qr_real_time = `
           	SELECT SUM (amount)::INT, extract (HOUR from created_at) as "from" , extract (HOUR from created_at)+1 as "to"  FROM receipts 
        	where date = '${date}'
        	group by (extract (HOUR from created_at))  
        `;
    const data = await prisma.$queryRawUnsafe(qr_real_time);
    return generateRes(data);
  };

  //   ------------------------- GET REAL-TIME COLLECTION ----------------------------//


  generateAllReports = async (req: Request) => {
    const { from_date, to_date } = req.body;

    const qr_func = (condition?: string) => {
      return `
       SELECT
          COUNT(receipt_no)::INT AS receipt_count,
        SUM(amount)::INT AS total_amount, receipts.conductor_id, date, pa.register_no as bus_no
        FROM receipts
        JOIN bus_master as pa on pa.register_no = receipts.bus_id
        ${
          condition || ''
        }
        GROUP BY date, receipts.conductor_id, pa.register_no
        ORDER BY date;
      `;
    };

    let qr_1 = qr_func();

    if (from_date && to_date) {
      qr_1 = qr_func(`
        where date between '${from_date}' and '${to_date}'
      `);
    }
    const [data] = await prisma.$transaction([
      prisma.$queryRawUnsafe(qr_1)
    ]);

    
    return generateRes(data);
  };
}

export default ReportDao;
