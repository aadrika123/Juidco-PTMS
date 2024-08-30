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

    const from_date: string = String(req.query.from_date);
    const to_date: string = String(req.query.to_date);

    const query: Prisma.conductor_masterFindManyArgs = {
      skip: (page - 1) * limit,
      take: limit,
      select: {
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

    if (id !== "" && id !== "undefined") {
      query.where = {
        cunique_id: id,
      };
    }

    if (search !== "" && typeof search === "string" && search !== "undefined") {
      query.where = {
        OR: [
          {
            cunique_id: { contains: search, mode: "insensitive" },
          },
          {
            first_name: { contains: search, mode: "insensitive" },
          },
        ],
      };
    }
    const [data, count] = await prisma.$transaction([
      prisma.conductor_master.findMany(query) as any,
      prisma.conductor_master.count(),
    ]);

    await Promise.all(
      data.map(async (item: any) => {
        const busData: any[] = await prisma.$queryRawUnsafe(`
          select bus_id, sum(amount)::INT as total_collection ,date, bm.status ,receipts.conductor_id 
          from receipts 
          LEFT JOIN bus_master as bm ON receipts.bus_id = bm.register_no
          LEFT JOIN conductor_master as cm ON receipts.conductor_id = cm.cunique_id
          where conductor_id = '${item?.cunique_id}'
          and date between '${from_date}' and '${to_date}'
          group by bus_id, date, bm.status, receipts.conductor_id 
          order by date ASC
        `)

        await Promise.all(
          busData.map(async (bus: any) => {
            const date = new Date(bus?.date);
            const formattedDate = date.toISOString().split('T')[0];
            const receiptBreakup: any[] = await prisma.$queryRawUnsafe(`
              select bus_id,amount::INT, count(amount)::INT, sum(amount)::INT,date::DATE from receipts
              WHERE bus_id = '${bus?.bus_id}' 
              and conductor_id = '${item?.cunique_id}' 
              AND date = '${formattedDate}'
              group by bus_id, amount, date
              ORDER BY date ASC
            `)

            bus.breakup = receiptBreakup

          })
        )

        const receiptData: any[] = await prisma.$queryRawUnsafe(`
          select sum(amount)::INT as total_bus_collection from receipts
          where conductor_id = '${item?.cunique_id}'
          and date between '${from_date}' and '${to_date}'
        `)

        item.bus_data = busData
        item.receipt_data = receiptData[0]

      })
    )

    return generateRes({ data, count, page, limit });
  };

  getConductorStatus = async () => {
    const date = new Date().toISOString().split("T")[0];
    const qr_total_conductor: string =
      "SELECT COUNT(id)::INT FROM conductor_master;";
    const qr_conductor_status: string = `
       SELECT 
	    COUNT(DISTINCT sche.conductor_id)::INT AS scheduled_conductor,
	    COUNT(DISTINCT cm.cunique_id)::INT - COUNT(DISTINCT sche.conductor_id)::INT AS absent_conductor
	        FROM conductor_master AS cm
	    LEFT JOIN scheduler AS sche ON cm.cunique_id = sche.conductor_id  
      `;

    const [total_conductor, conductor_status] = await prisma.$transaction([
      prisma.$queryRawUnsafe(`${qr_total_conductor}`),
      prisma.$queryRawUnsafe(`${qr_conductor_status}AND sche.date = '${date}'`),
    ]);

    return generateRes({ total_conductor, conductor_status });
  };

  // !----------------------------- CHECK EMPLOYEE ID EXIST OR NOT ------------------------------//
  validate_aadhar = async (req: Request) => {
    const adhar_no = req.body.adhar_no;

    const exist = await prisma.$queryRaw`
        SELECT EXISTS (SELECT 1 FROM conductor_master WHERE adhar_no = ${adhar_no});
      `;

    console.log(exist);

    return generateRes(exist);
  };
}

export default ConductorOnBoarding;
