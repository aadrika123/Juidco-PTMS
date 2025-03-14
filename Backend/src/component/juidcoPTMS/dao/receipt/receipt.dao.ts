import { Request } from "express";
import { Prisma, PrismaClient } from "@prisma/client";
import { generateRes } from "../../../../util/generateRes";
import { generateReceiptNumber } from "../../../../util/helper/generateUniqueNo";

const prisma = new PrismaClient();

export const genrateDate = () => { };
class ReceiptDao {
  // post = async (req: Request) => {
  //   const { ulb_id } = req.body.auth
  //   console.log("before creating");
  //   console.log(req.body.data, "req.body.data");


  //   // const time = Number(req.body.data.time);
  //   //const date = new Date(`${req.body.data.date}T10:19:58.523Z`);
  //   const date = new Date(req.body.data.date);

  //   // const scheduleRecord = await prisma.$queryRawUnsafe<any[]>(`
  //   // select * from scheduler where conductor_id=${req.body.data.conductor_id}
  //   // and from_time <= ${time} and to_time>= ${time}
  //   // and date::date = '${req.body.data.date}'`);

  //   // console.log(scheduleRecord, "rec");

  //   // if (scheduleRecord.length <= 0) return;

  //   const data = await prisma.receipts.create({
  //     data: {
  //       amount: req.body.data.amount,
  //       bus_id: req.body.data.bus_id,
  //       // bus: { connect: { register_no: scheduleRecord[0].bus_id } },
  //       date: date,
  //       conductor_id: req.body.data.conductor_id,
  //       time: req.body.data.time,
  //       receipt_no: req.body.data.receipt_no,
  //       ulb_id: ulb_id
  //       // conductor: { connect: { cunique_id: req.body.data.conductor_id } },
  //     },
  //   });
  //   console.log(data, "after creating");

  //   const receipt_no = generateReceiptNumber(data.id);
  //   const dataWithReceiptNo = await prisma.receipts.update({
  //     where: { id: data.id },
  //     data: { receipt_no },
  //   });

  //   return generateRes(dataWithReceiptNo);
  // };



  

  post = async (req: Request) => {
    const { ulb_id } = req.body.auth;
    console.log("Before creating");
  
    const { amount, bus_id, conductor_id, date, time } = req.body.data;
    const formattedDate = new Date(date);
    console.log("Formatted date:", formattedDate);
  
    // Fetch the last inserted receipt to get the last receipt_no
    const lastReceipt = await prisma.receipts.findFirst({
      orderBy: { id: "desc" }, // Get the latest receipt
      select: { receipt_no: true }
    });
  
    // Extract number from last receipt_no and increment
    let newReceiptNo = "T000000001"; // Default value if no previous records exist
    if (lastReceipt?.receipt_no) {
      const lastNumber = parseInt(lastReceipt.receipt_no.replace("T", ""), 10);
      const incrementedNumber = lastNumber + 1;
  
      // Ensure minimum 9 characters and maximum 14 characters
      const paddedNumber = incrementedNumber.toString().padStart(8, "0"); // Ensures at least 9 chars including "T"
      newReceiptNo = `T${paddedNumber}`.slice(0, 14); // Ensures max 14 chars
    }
  
    console.log("Generated receipt_no:", newReceiptNo);
  
    // Create receipt with the new receipt_no
    const data = await prisma.receipts.create({
      data: {
        amount,
        bus_id,
        date: formattedDate,
        conductor_id,
        time,
        receipt_no: newReceiptNo, // Directly inserting incremented value
        ulb_id
      }
    });
  
    console.log("Receipt created:", data);
  
    return generateRes(data);
  };
  
  


  // ======================== GET RECEIPTS =========================================//
  get = async (req: Request) => {
    const { from_date, to_date, bus_no, conductor_id } = req.body;
    const page: number = Number(req.query.page);
    const limit: number = Number(req.query.limit);
    const search: string = String(req.query.search);
    const { ulb_id } = req.body.auth

    const d1 = new Date(from_date);
    const d2 = new Date(to_date);
    const query: Prisma.receiptsFindManyArgs = {
      skip: (page - 1) * limit,
      take: limit,
      select: {
        amount: true,
        bus: {
          select: {
            id: true,
            register_no: true,
            vin_no: true,
          },
        },
        conductor: {
          select: {
            first_name: true,
            middle_name: true,
            last_name: true,
            age: true,
            blood_grp: true,
            mobile_no: true,
            emergency_mob_no: true,
            email_id: true,
            cunique_id: true,
            adhar_no: true,
          },
        },
        time: true,
        receipt_no: true,
        date: true,
      },
    };

    query.where = {
      ulb_id: ulb_id
    }

    if (conductor_id) {
      query.where = {
        OR: [
          {
            conductor: {
              cunique_id: { equals: conductor_id, mode: "insensitive" },
            },
          },
        ],
      };
    }

    if (search !== "" && typeof search === "string" && search !== "undefined") {
      query.where = {
        OR: [
          {
            bus: {
              register_no: { contains: search, mode: "insensitive" },
            },
          },

          {
            bus: {
              vin_no: { contains: search, mode: "insensitive" },
            },
          },
        ],
      };
    }

    if (bus_no) {
      query.where = {
        OR: [
          {
            bus: {
              register_no: { equals: bus_no, mode: "insensitive" },
            },
          },
        ],
      };
    }

    if (from_date && to_date && conductor_id) {
      query.where = {
        AND: [
          {
            conductor: {
              cunique_id: { equals: conductor_id, mode: "insensitive" },
            },
          },
          {
            date: {
              gte: d1,
              lte: d2,
            },
          },
        ],
      };
    }

    if (from_date && to_date && bus_no) {
      query.where = {
        AND: [
          {
            bus: {
              register_no: { equals: bus_no, mode: "insensitive" },
            },
          },
          {
            date: {
              gte: d1,
              lte: d2,
            },
          },
        ],
      };
    }

    const [data, count] = await prisma.$transaction([
      prisma.receipts.findMany(query),
      prisma.receipts.count({ where: query.where }),
    ]);

    return generateRes({ data, count, page, limit });
  };

  passenger_status = async (req: Request) => {
    const { from_date, to_date } = req.body;
    const { ulb_id } = req.body.auth

    const date = new Date().toISOString().split("T")[0];

    const qr_func = (condition?: string) => {
      return `
        SELECT COUNT(id)::INT,SUM (amount)::INT,COUNT(id)::INT as no_of_receips FROM receipts ${condition ? condition : `where ulb_id=${ulb_id} and date = '${date}'`
        } 
      `;
    };

    let qr = qr_func();

    if (from_date && to_date) {
      qr = qr_func(`where ulb_id=${ulb_id} and date BETWEEN '${from_date}' AND '${to_date}'`);
    }

    const data = await prisma.$queryRawUnsafe(qr);

    return generateRes(data);
  };
}

export default ReceiptDao;
