import { Request } from "express";
import { PrismaClient } from "@prisma/client";
import { generateRes } from "../../../../util/generateRes";
import { getCurrentWeekRange } from "../../../../util/helper";

const prisma = new PrismaClient();
class ReportDao {
  generateReport = async (req: Request) => {
    const { conductor_id, bus_id, from_date, to_date } = req.body;
    const { ulb_id } = req.body.auth
    let amounts: any = [];
    let query: string = "";
    const conductor: string = ", receipts.conductor_id ";

    function query_fn(extend_query: string, conductor?: string): string {
      return `
        select bus_id, sum(amount)::INT as total_collection ,date, bm.status ${conductor || ""
        } from receipts 
        LEFT JOIN bus_master as bm ON receipts.bus_id = bm.register_no
        LEFT JOIN conductor_master as cm ON receipts.conductor_id = cm.cunique_id
        ${extend_query} group by bus_id, date, bm.status ${conductor || ""
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

    const conditionRegex = /(JOIN|ORDER BY|LIMIT|OFFSET)/i;
    const whereData = 'where';
    const whereRegex = new RegExp(`\\b${whereData}\\b`, 'i');

    // First, check if WHERE clause exists
    if (whereRegex.test(query)) {
      // If WHERE exists, insert ulb_id before JOIN, ORDER BY, LIMIT, or OFFSET
      query = query.replace(conditionRegex, `AND ulb_id = '${ulb_id}' $1`);
    } else {
      // If WHERE does not exist, insert WHERE ulb_id before JOIN, ORDER BY, LIMIT, or OFFSET
      if (conditionRegex.test(query)) {
        // If there is a JOIN, ORDER BY, LIMIT, or OFFSET, insert WHERE ulb_id before them
        query = query.replace(conditionRegex, `WHERE ulb_id = '${ulb_id}' $1`);
      } else {
        // If no JOIN, ORDER BY, LIMIT, or OFFSET, just append WHERE ulb_id
        query += ` WHERE ulb_id = '${ulb_id}'`;
      }
    }

    const [data] = await prisma.$transaction([
      prisma.$queryRawUnsafe<any[]>(`${query}`),
    ]);

    const result = {
      data: [...data],
      amounts,
    };
    return generateRes({ result });
  };

  getTotalAmount = async (req: Request) => {
    const { bus_id, conductor_id, from_date, to_date, curr_date } = req.body;
    const { ulb_id } = req.body.auth
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

    const conditionRegex = /(JOIN|ORDER BY|LIMIT|OFFSET)/i;
    const whereData = 'where';
    const whereRegex = new RegExp(`\\b${whereData}\\b`, 'i');

    // First, check if WHERE clause exists
    if (whereRegex.test(query)) {
      // If WHERE exists, insert ulb_id before JOIN, ORDER BY, LIMIT, or OFFSET
      query = query.replace(conditionRegex, `AND ulb_id = '${ulb_id}' $1`);
    } else {
      // If WHERE does not exist, insert WHERE ulb_id before JOIN, ORDER BY, LIMIT, or OFFSET
      if (conditionRegex.test(query)) {
        // If there is a JOIN, ORDER BY, LIMIT, or OFFSET, insert WHERE ulb_id before them
        query = query.replace(conditionRegex, `WHERE ulb_id = '${ulb_id}' $1`);
      } else {
        // If no JOIN, ORDER BY, LIMIT, or OFFSET, just append WHERE ulb_id
        query += ` WHERE ulb_id = '${ulb_id}'`;
      }
    }

    //   ------------------------- FILTER BY CURRENT_DATE TOTAL COLLECTION-----------------------------//
    const data = await prisma.$queryRawUnsafe(`${query}`);

    return generateRes(data);
  };

  //   ------------------------- GET REAL-TIME COLLECTION ----------------------------//

  getRealTimeCollection = async (req: Request) => {
    // const date = new Date().toISOString().split("T")[0];
    // const qr_real_time = `
    //       SELECT SUM (amount)::INT, extract (HOUR from created_at) as "from" , extract (HOUR from created_at)+1 as "to", COUNT(id)::INT as receipts FROM receipts
    //     	where date = '${date}'
    //     	group by (extract (HOUR from created_at))
    //     `;

    const { ulb_id } = req.body.auth

    const qr_real_time = `
      SELECT
          SUM(amount)::INT AS sum,
          TO_CHAR(created_at, 'YYYY-MM-DD') AS day,
          COUNT(id)::INT AS receipts
      FROM
          receipts
      WHERE
          ulb_id = ${ulb_id} and
          created_at >= DATE_TRUNC('month', CURRENT_DATE)
          AND created_at < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month'
      GROUP BY
          TO_CHAR(created_at, 'YYYY-MM-DD')
      ORDER BY
          day;

    `;

    const data = await prisma.$queryRawUnsafe(qr_real_time);
    return generateRes(data);
  };

  //   ------------------------- GET REAL-TIME COLLECTION ----------------------------//

  //   ------------------------- GET ALL REPORT COLLECITON ----------------------------//
  generateAllReports = async (req: Request) => {
    const { from_date, to_date } = req.body;
    const { ulb_id } = req.body.auth
    const limit: number = Number(req.query.limit);
    const page: number = Number(req.query.page);

    const offset = (page - 1) * limit;

    const qr_func = (condition?: string) => {
      return `
      SELECT
      COUNT(receipt_no)::INT AS receipt_count,
      SUM(amount)::INT AS total_amount, receipts.conductor_id, 
        pa.register_no as bus_no, cm.first_name, cm.last_name, cm.age, cm.adhar_no, cm.mobile_no,
	      pa.register_no, pa.vin_no
      FROM receipts
      JOIN bus_master as pa on pa.register_no = receipts.bus_id
      JOIN conductor_master as cm on cm.cunique_id = receipts.conductor_id
      ${condition || ""}
      GROUP BY receipts.conductor_id, pa.register_no, cm.id, pa.id
      LIMIT $1 OFFSET $2
      `;
    };

    // const qr_func_2 = (conductor_id?: string, condition?: string) => {
    //   return `
    //     select receipts.* , conductor.* as conductor from receipts
    //     JOIN conductor_master as conductor ON receipts.conductor_id = conductor.cunique_id
    //     where receipts.conductor_id = '${conductor_id}' ${condition || ""};
    //   `;
    // };
    const qr_func_2 = (conductor_id?: string, condition?: string) => {
      return `
        select receipts.* , conductor.first_name, conductor.last_name, conductor.age, conductor.mobile_no, conductor.emergency_mob_no, conductor.email_id  from receipts
        JOIN conductor_master as conductor ON receipts.conductor_id = conductor.cunique_id
        where receipts.conductor_id = '${conductor_id}' ${condition || ""};
      `;
    };

    let qr_1 = qr_func();
    let qr_2 = qr_func_2();

    if (from_date && to_date) {
      qr_1 = qr_func(`
        where date between '${from_date}' and '${to_date}'
      `);
    }

    const conditionRegex = /(ORDER BY|GROUP BY|LIMIT|OFFSET)/i;
    const whereData = 'where';
    const whereRegex = new RegExp(`\\b${whereData}\\b`, 'i');

    if (whereRegex.test(qr_1)) {
      qr_1 = qr_1.replace(conditionRegex, `AND receipts.ulb_id = '${ulb_id}' $1`);
    } else {
      if (conditionRegex.test(qr_1)) {
        qr_1 = qr_1.replace(conditionRegex, `WHERE receipts.ulb_id = '${ulb_id}' $1`);
      } else {
        qr_1 += ` WHERE ulb_id = '${ulb_id}'`;
      }
    }

    if (whereRegex.test(qr_2)) {
      qr_2 = qr_2.replace(conditionRegex, `AND ulb_id = '${ulb_id}' $1`);
    } else {
      if (conditionRegex.test(qr_2)) {
        qr_2 = qr_2.replace(conditionRegex, `WHERE ulb_id = '${ulb_id}' $1`);
      } else {
        qr_2 += ` WHERE ulb_id = '${ulb_id}'`;
      }
    }

    // const startTime = Date.now();
    const [all_conductor] = await prisma.$transaction([
      prisma.$queryRawUnsafe<any[]>(qr_1, limit, offset),
    ]);
    // const endTime = Date.now();
    // const duration = endTime - startTime;
    // console.log('duration',duration, 'ms')

    const all_conductor_data: any[] = [];
    if (all_conductor !== null) {
      const promises = all_conductor.map(async (item: any) => {
        if (from_date && to_date) {
          qr_2 = qr_func_2(
            item?.conductor_id,
            `AND date between '${from_date}' and '${to_date}'`
          );
        } else {
          qr_2 = qr_func_2(item?.conductor_id);
        }
        const [data] = await prisma.$transaction([
          prisma.$queryRawUnsafe(qr_2),
        ]);
        return {
          conductor_id: item?.conductor_id,
          data: { ...item, details: data },
        };
      });

      const results = await Promise.all(promises);

      results.forEach((result) => {
        all_conductor_data.push(result);
      });
    }

    return generateRes(all_conductor_data);
  };



  generateAllReports1 = async (req: Request) => {
  const { from_date, to_date } = req.body;
  const { ulb_id } = req.body.auth;
  const limit: number = Number(req.query.limit) || 10;
  const page: number = Number(req.query.page) || 1;

  const offset = (page - 1) * limit;

  const baseCondition = `
    FROM receipts
    JOIN bus_master as pa on pa.register_no = receipts.bus_id
    JOIN conductor_master as cm on cm.cunique_id = receipts.conductor_id
    WHERE receipts.ulb_id = '${ulb_id}'
    ${from_date && to_date ? `AND date BETWEEN '${from_date}' AND '${to_date}'` : ""}
  `;

  // 🔹 Query for paginated grouped data
  const qr_data = `
    SELECT
      COUNT(receipt_no)::INT AS receipt_count,
      SUM(amount)::INT AS total_amount,
      receipts.conductor_id, 
      pa.register_no as bus_no,
      cm.first_name,
      cm.last_name,
      cm.age,
      cm.adhar_no,
      cm.mobile_no,
      pa.register_no,
      pa.vin_no
    ${baseCondition}
    GROUP BY receipts.conductor_id, pa.register_no, cm.id, pa.id
    LIMIT $1 OFFSET $2
  `;

  // 🔹 Query for total grouped count (for pagination)
  const qr_count = `
    SELECT COUNT(*)::INT as total
    FROM (
      SELECT receipts.conductor_id
      ${baseCondition}
      GROUP BY receipts.conductor_id, pa.register_no, cm.id, pa.id
    ) as subquery
  `;

  // 🔹 Query for overall total amount (no group, no limit)
  const qr_total_amount = `
    SELECT COALESCE(SUM(amount), 0)::INT as grand_total
    ${baseCondition}
  `;

  const [all_conductor, totalCount, totalAmount] = await prisma.$transaction([
    prisma.$queryRawUnsafe<any[]>(qr_data, limit, offset),
    prisma.$queryRawUnsafe<any[]>(qr_count),
    prisma.$queryRawUnsafe<any[]>(qr_total_amount),
  ]);

  const count = totalCount[0]?.total || 0;
  const grandTotal = totalAmount[0]?.grand_total || 0;

  return {
    ...generateRes(all_conductor ?? [], count, page, limit),
    grandTotalCollectionAmount: grandTotal, // 👈 extra field added
  };
};


  //   ------------------------- GET ALL REPORT COLLECITON ----------------------------//

  demographicCount = async (req: Request) => {
    const { from_date, to_date } = req.body;
    const { ulb_id } = req.body.auth

    const { startOfWeek, endOfWeek } = getCurrentWeekRange();

    const qr_func = (condition?: string) => {
      return `
        	SELECT
            COUNT(id)::INT AS customer_count,
            SUM(amount)::INT AS total_amount,
            date
          FROM receipts
         ${condition || `where date between '${startOfWeek}' and '${endOfWeek}'`
        } group by date
      `;
    };

    let qr_1 = qr_func();
    if (from_date && to_date) {
      qr_1 = qr_func(`
        where date between '${from_date}' and '${to_date}'
      `);
    }

    const conditionRegex = /(JOIN|ORDER BY|LIMIT|OFFSET)/i;
    const whereData = 'where';
    const whereRegex = new RegExp(`\\b${whereData}\\b`, 'i');

    if (whereRegex.test(qr_1)) {
      qr_1 = qr_1.replace(conditionRegex, `AND ulb_id = '${ulb_id}' $1`);
    } else {
      if (conditionRegex.test(qr_1)) {
        qr_1 = qr_1.replace(conditionRegex, `WHERE ulb_id = '${ulb_id}' $1`);
      } else {
        qr_1 += ` WHERE ulb_id = '${ulb_id}'`;
      }
    }

    const [data] = await prisma.$transaction([prisma.$queryRawUnsafe(qr_1)]);

    return generateRes(data);
  };

  getUlbData = async (req: Request) => {
    const { auth } = req.body;


    // const data: any = await prisma.$queryRaw`
    // select id,ulb_name from ulb_masters where id=${auth?.ulb_id}
    // `

    const [data] = await prisma.$transaction([prisma.$queryRawUnsafe(`select id::INT,ulb_name from ulb_masters where id=${auth?.ulb_id}`)]);

    return generateRes(data);
  };

  getHourlyRealtimeData = async (req: Request) => {
    const { ulb_id } = req.body.auth

    const query = `
      WITH intervals AS (
          SELECT 
              generate_series(0, 22, 2) AS interval_start_hour
      )
      SELECT
          COALESCE(COUNT(r.id), 0)::INT AS customer_count,
          COALESCE(SUM(r.amount), 0)::INT AS total_amount,
          i.interval_start_hour,
          i.interval_start_hour + 2 AS interval_end_hour
      FROM
          intervals i
      LEFT JOIN
          receipts r
          ON EXTRACT(HOUR FROM r.created_at)::INT / 2 * 2 = i.interval_start_hour
          AND r.date = CURRENT_DATE
          AND r.ulb_id = ${ulb_id}
      GROUP BY
          i.interval_start_hour
      ORDER BY
          i.interval_start_hour;
    `

    const data: any[] = await prisma.$queryRawUnsafe(query);

    return data
  };

}



export default ReportDao;
