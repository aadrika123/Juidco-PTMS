import { Request } from "express";
import { Prisma, PrismaClient } from "@prisma/client";
import { generateRes } from "../../../../util/generateRes";

type TOnBoardingBusData = {
  id: number;
  registration_no: string;
  vin_no: string;
  taxCopy_cert: object;
  registration_cert: object;
  pollution_cert: object;
};

const prisma = new PrismaClient();

class BusOnboarding {
  onBoardingNewBus = async (req: Request) => {
    const {
      registration_no,
      vin_no,
      taxCopy_cert,
      registration_cert,
      pollution_cert,
    } = req.body as TOnBoardingBusData;

    const { ulb_id } = req.body.auth

    const isExistingBus = await prisma.bus_master.findUnique({
      where: { vin_no: vin_no },
    });

    if (isExistingBus) {
      return generateRes({
        error_type: "VALIDATION",
        validation_error: "Already Exist",
      });
    }

    const query: Prisma.bus_masterCreateArgs = {
      data: {
        pollution_doc: pollution_cert,
        registrationCert_doc: registration_cert,
        register_no: registration_no,
        taxCopy_doc: taxCopy_cert,
        vin_no: vin_no,
        ulb_id: ulb_id
      },
    };

    const newOnboardedBus = await prisma.bus_master.create(query);

    return generateRes(newOnboardedBus);
  };

  getAllBusList = async (req: Request) => {
    const id = String(req.query.id); // cunique_id filter
    const page: number = Number(req.query.page);
    const limit: number = Number(req.query.limit);
    const search: string = String(req.query.search); // Search term
  
    console.log("req", req?.query);
  
    const { ulb_id } = req.body.auth; // Getting ulb_id from the request body
  
    const from_date: string | undefined = req.query.from_date && String(req.query.from_date);
    const to_date: string | undefined = req.query.to_date && String(req.query.to_date);
  
    // Prepare the base query
    const query: Prisma.bus_masterFindManyArgs = {
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        register_no: true,
        vin_no: true,
        pollution_doc: true,
        taxCopy_doc: true,
        registrationCert_doc: true,
      },
      where: {
        ulb_id, // Filter by ulb_id
      },
      orderBy: req?.query?.view
        ? [{ created_at: "desc" }]
        : [{ receipts: { _count: "desc" } }],
    };
  
    // Apply filters for 'id' and 'search'
    if (id !== "" && id !== "undefined") {
      // If id is provided, filter by register_no
      query.where = {
        ...query.where,
        register_no: id,
      };
    }
  
    if (search !== "" && search !== "undefined") {
      // If search term is provided, filter by register_no and vin_no
      query.where = {
        ...query.where,
        OR: [
          { register_no: { contains: search, mode: "insensitive" } },
          { vin_no: { contains: search, mode: "insensitive" } },
        ],
      };
    }
  
    // Fetch data and count from the database
    try {
      const [data, count] = await prisma.$transaction([
        prisma.bus_master.findMany(query) as any,
        prisma.bus_master.count({
          where: query.where, // Count based on the same where clause
        }),
      ]);
  
      // Enrich data with bus receipt and collection details
      await Promise.all(
        data.map(async (item: any) => {
          const busData: any[] = await prisma.$queryRawUnsafe(`
            SELECT bus_id, SUM(amount)::INT AS total_collection, date, bm.status, receipts.conductor_id
            FROM receipts
            LEFT JOIN bus_master AS bm ON receipts.bus_id = bm.register_no
            LEFT JOIN conductor_master AS cm ON receipts.conductor_id = cm.cunique_id
            WHERE bus_id = '${item?.register_no}'
            ${(from_date && to_date) ? `AND date BETWEEN '${from_date}' AND '${to_date}'` : ''}
            GROUP BY bus_id, date, bm.status, receipts.conductor_id
            ORDER BY date ASC
          `);
  
          // Fetch detailed breakdown of each bus data entry
          await Promise.all(
            busData.map(async (bus: any) => {
              const date = new Date(bus?.date);
              const formattedDate = date.toISOString().split('T')[0];
              const receiptBreakup: any[] = await prisma.$queryRawUnsafe(`
                SELECT conductor_id, amount::INT, COUNT(amount)::INT, SUM(amount)::INT, date::DATE
                FROM receipts
                WHERE bus_id = '${item?.register_no}' 
                AND conductor_id = '${bus?.conductor_id}' 
                AND date = '${formattedDate}'
                GROUP BY conductor_id, amount, date
                ORDER BY date ASC
              `);
  
              bus.breakup = receiptBreakup;
            })
          );
  
          // Fetch total collection data for the bus
          const receiptData: any[] = await prisma.$queryRawUnsafe(`
            SELECT SUM(amount)::INT AS total_bus_collection
            FROM receipts
            WHERE bus_id = '${item?.register_no}'
            ${(from_date && to_date) ? `AND date BETWEEN '${from_date}' AND '${to_date}'` : ''}
          `);
  
          item.bus_data = busData;
          item.receipt_data = receiptData[0];
        })
      );
  
      // Return the response with the data and pagination info
      return generateRes({ data, count, page, limit });
    } catch (error) {
      console.error("Error fetching bus data:", error);
      throw new Error("Unable to fetch bus data");
    }
  };
  

  updateBusDetails = async (req: Request) => {
    const {
      id,
      registration_no,
      vin_no,
      taxCopy_cert,
      registration_cert,
      pollution_cert,
    } = req.body as TOnBoardingBusData;

    const query: Prisma.bus_masterUpdateManyArgs = {
      data: {
        pollution_doc: pollution_cert,
        registrationCert_doc: registration_cert,
        register_no: registration_no,
        taxCopy_doc: taxCopy_cert,
        vin_no: vin_no,
      },
      where: {
        id: id,
      },
    };
    const data = await prisma.bus_master.updateMany(query);
    return generateRes(data);
  };

  deleteBus = async (req: Request) => {
    const { id } = req.body;

    const data = await prisma.bus_master.delete({
      where: {
        id: id,
      },
    });

    return generateRes(data);
  };

  getBusImage = async (req: Request) => {
    const { id } = req.params;

    const data = await prisma.bus_master.findFirst({
      where: {
        id: Number(id),
      },
      select: {
        taxCopy_doc: true,
        pollution_doc: true,
        registrationCert_doc: true
      }
    });

    return generateRes(data);
  };

  updateBusDetailsV2 = async (req: Request) => {
    const {
      id,
      taxCopy_cert,
      registration_cert,
      pollution_cert,
    } = req.body as TOnBoardingBusData;

    if (!id) {
      throw new Error('ID is required')
    }

    if (!taxCopy_cert && !registration_cert && !pollution_cert) {
      throw new Error('No data provided to update')
    }

    const query: Prisma.bus_masterUpdateArgs = {
      data: {
        ...(pollution_cert && { pollution_doc: pollution_cert }),
        ...(registration_cert && { registrationCert_doc: registration_cert }),
        ...(taxCopy_cert && { taxCopy_doc: taxCopy_cert }),
      },
      where: {
        id: id,
      },
    };
    const data = await prisma.bus_master.update(query);
    return generateRes(data);
  };

  getBusById = async (id: number) => {
    const data = await prisma.bus_master.findFirst({
      where: {
        id: id
      }
    });
    return generateRes(data);
  };

}

export default BusOnboarding;
