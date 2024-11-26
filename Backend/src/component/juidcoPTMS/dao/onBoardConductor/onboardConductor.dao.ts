import { Request } from "express";
import { Prisma, PrismaClient } from "@prisma/client";
import { generateRes } from "../../../../util/generateRes";
import generateUniqueId from "../../../../util/helper/generateUniqueNo";

type TOnBoardingConductorData = {
  firstName: string;
  middleName: string;
  lastName: string;
  age: string;
  bloodGrp: string;
  mobileNo: string;
  emailId: string;
  emergencyMobNo: string;
  adhar_doc: object;
  adhar_no: string;
  fitness_doc: object;
};

const prisma = new PrismaClient();
class ConductorOnBoarding {
  onBoardingNewConductor = async (req: Request) => {
    const {
      firstName,
      middleName,
      lastName,
      age,
      bloodGrp,
      mobileNo,
      emailId,
      emergencyMobNo,
      adhar_doc,
      adhar_no,
      fitness_doc,
    } = req.body as TOnBoardingConductorData;

    const { ulb_id } = req.body.auth

    const isExistingConductor = await prisma.conductor_master.findUnique({
      where: { adhar_no },
    });

    const isExistingConductorEmail = await prisma.conductor_master.findUnique({
      where: { email_id: emailId },
    });

    if (isExistingConductor) {
      return generateRes({
        error_type: "VALIDATION",
        validation_error: "Already Exist",
      });
    } else if (isExistingConductorEmail) {
      return generateRes({
        error_type: "VALIDATION",
        validation_error: "Email Already Exist",
      });
    }

    const cUniqueId = generateUniqueId("PTM");

    const query: Prisma.conductor_masterCreateArgs = {
      data: {
        first_name: firstName,
        middle_name: middleName,
        last_name: lastName,
        age: age,
        blood_grp: bloodGrp,
        mobile_no: mobileNo,
        email_id: emailId,
        emergency_mob_no: emergencyMobNo,
        adhar_doc: adhar_doc,
        adhar_no: adhar_no,
        fitness_doc: fitness_doc,
        cunique_id: cUniqueId,
        ulb_id: ulb_id
      },
    };

    const data = await prisma.conductor_master.create(query);
    return generateRes(data);
  };

  getAllConductorList = async (req: Request) => {
    const id = String(req.query.id);
    const page: number = Number(req.query.page);
    const limit: number = Number(req.query.limit);
    const search: string = String(req.query.search);
    const from_date: string | undefined = req.query.from_date ? String(req.query.from_date) : undefined;
    const to_date: string | undefined = req.query.to_date ? String(req.query.to_date) : undefined;
    const { ulb_id } = req.body.auth;
  
    const query: Prisma.conductor_masterFindManyArgs = {
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        first_name: true,
        middle_name: true,
        last_name: true,
        age: true,
        blood_grp: true,
        mobile_no: true,
        email_id: true,
        emergency_mob_no: true,
        adhar_no: true,
        cunique_id: true,
      },
    };
  
    if (search && search !== "undefined") {
      query.where = {
        OR: [
          { cunique_id: { contains: search, mode: "insensitive" } },
          { first_name: { contains: search, mode: "insensitive" } },
          { last_name: { contains: search, mode: "insensitive" } },
        ],
      };
    }
  
    if (id && id !== "undefined") {
      query.where = {
        ...(query.where || {}),
        cunique_id: id,
      };
    }
  
    query.where = {
      ...(query.where || {}),
      ulb_id: ulb_id,
    };
  
    if (req?.query?.view) {
      query.orderBy = [
        {
          created_at: "desc",
        },
      ];
    } else {
      query.orderBy = [
        {
          receipts: {
            _count: "desc",
          },
        },
      ];
    }
  
    console.log("query", query);
  
    // Fetch the conductor list and the total count of conductors
    const [data, count] = await prisma.$transaction([
      prisma.conductor_master.findMany(query) as any,
      prisma.conductor_master.count({
        where: query.where || {},
      }),
    ]);
  
    // Now, calculate the total sum of the amounts in the `receipts` table based on the search criteria
    const totalAmountQuery = `
      SELECT sum(amount)::INT as total_amount
      FROM receipts
      LEFT JOIN conductor_master as cm ON receipts.conductor_id = cm.cunique_id
      WHERE cm.ulb_id = '${ulb_id}'
      ${(search && search !== "undefined") ? `AND (cm.cunique_id LIKE '%${search}%' OR cm.first_name LIKE '%${search}%' OR cm.last_name LIKE '%${search}%')` : ""}
      ${(from_date && to_date) ? `AND receipts.date BETWEEN '${from_date}' AND '${to_date}'` : ""}
    `;
  
    // Fetch the total sum of the amounts
    const totalAmountResult: any[] = await prisma.$queryRawUnsafe(totalAmountQuery);
    const totalAmount = totalAmountResult[0]?.total_amount || 0;
  
    // Process each conductor to fetch additional data like bus collections
    await Promise.all(
      data.map(async (item: any) => {
        // Fetch bus data for the conductor
        const busData: any[] = await prisma.$queryRawUnsafe(`
          select bus_id, sum(amount)::INT as total_collection, date, bm.status, receipts.conductor_id
          from receipts
          LEFT JOIN bus_master as bm ON receipts.bus_id = bm.register_no
          WHERE conductor_id = '${item?.cunique_id}'
          ${(from_date && to_date) ? `and date between '${from_date}' and '${to_date}'` : ''}
          group by bus_id, date, bm.status, receipts.conductor_id
          order by date ASC
        `);
  
        // Fetch detailed receipt breakup for each bus
        await Promise.all(
          busData.map(async (bus: any) => {
            const date = new Date(bus?.date);
            const formattedDate = date.toISOString().split("T")[0]; // Format date to YYYY-MM-DD
            const receiptBreakup: any[] = await prisma.$queryRawUnsafe(`
              select bus_id, amount::INT, count(amount)::INT, sum(amount)::INT, date::DATE 
              from receipts
              WHERE bus_id = '${bus?.bus_id}' 
              and conductor_id = '${item?.cunique_id}' 
              AND date = '${formattedDate}'
              group by bus_id, amount, date
              ORDER BY date ASC
            `);
  
            bus.breakup = receiptBreakup;
          })
        );
  
        // Fetch total bus collection for the conductor
        const receiptData: any[] = await prisma.$queryRawUnsafe(`
          select sum(amount)::INT as total_bus_collection
          from receipts
          where conductor_id = '${item?.cunique_id}'
          ${(from_date && to_date) ? `and date between '${from_date}' and '${to_date}'` : ''}
        `);
  
        item.bus_data = busData;
        item.receipt_data = receiptData[0];
        console.log("receiptDatareceiptDatareceiptDatareceiptData", receiptData);
      })
    );
  
    // Return the response with total amount and other data
    return generateRes({ data, count, page, limit, totalAmount });
  };
  
  
  

  getConductorStatus = async (req: Request) => {
    const date = new Date().toISOString().split("T")[0];
    const { ulb_id } = req.body.auth
    const qr_total_conductor: string =
      `SELECT COUNT(id)::INT FROM conductor_master where ulb_id=${ulb_id};`;
    const qr_conductor_status: string = `
       SELECT 
	    COUNT(DISTINCT sche.conductor_id)::INT AS scheduled_conductor,
	    COUNT(DISTINCT cm.cunique_id)::INT - COUNT(DISTINCT sche.conductor_id)::INT AS absent_conductor
	        FROM conductor_master AS cm
	    LEFT JOIN scheduler AS sche ON cm.cunique_id = sche.conductor_id  
      `;

    const [total_conductor, conductor_status] = await prisma.$transaction([
      prisma.$queryRawUnsafe(`${qr_total_conductor}`),
      prisma.$queryRawUnsafe(`${qr_conductor_status}AND sche.date = '${date}' where cm.ulb_id=${ulb_id}`),
    ]);

    return generateRes({ total_conductor, conductor_status });
  };

  // !----------------------------- CHECK EMPLOYEE ID EXIST OR NOT ------------------------------//
  validate_aadhar = async (req: Request) => {
    const adhar_no = req.body.adhar_no;
    const { ulb_id } = req.body.auth

    const exist = await prisma.$queryRaw`
        SELECT EXISTS (SELECT 1 FROM conductor_master WHERE adhar_no = ${adhar_no} and ulb_id=${ulb_id});
      `;

    console.log(exist);

    return generateRes(exist);
  };

  getConductorImage = async (req: Request) => {
    const { id } = req.params;

    const data = await prisma.conductor_master.findFirst({
      where: {
        id: Number(id),
      },
      select: {
        adhar_doc: true,
        fitness_doc: true
      }
    });

    return generateRes(data);
  };

  updateConductorDetails = async (req: Request) => {
    const {
      id,
      mobileNo,
      emergencyMobNo,
    } = req.body;

    if (!id) {
      throw new Error('ID is required')
    }

    if (!mobileNo && !emergencyMobNo) {
      throw new Error('No data provided to update')
    }

    const query: Prisma.conductor_masterUpdateArgs = {
      data: {
        ...(mobileNo && { mobile_no: mobileNo }),
        ...(emergencyMobNo && { emergency_mob_no: emergencyMobNo })
      },
      where: {
        id: id,
      },
    };
    const data = await prisma.conductor_master.update(query);
    return generateRes(data);
  };

  getConductorById = async (id: number) => {
    const data = await prisma.conductor_master.findFirst({
      where: {
        id: id
      }
    });
    return generateRes(data);
  };

}

export default ConductorOnBoarding;
