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
    const id = String(req.query.id);
    const page: number = Number(req.query.page);
    const limit: number = Number(req.query.limit);
    const search: string = String(req.query.search);

    const { ulb_id } = req.body.auth

    const from_date: string | undefined = req.query.from_date && String(req.query.from_date);
    const to_date: string | undefined = req.query.from_date && String(req.query.to_date);

    const query: Prisma.bus_masterFindManyArgs = {
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        register_no: true,
        vin_no: true,
      },
    };

    query.where = {
      ulb_id: ulb_id
    }

    if (id !== "" && id !== "undefined") {
      query.where = {
        register_no: id,
      };
    }

    if (search !== "" && typeof search === "string" && search !== "undefined") {
      query.where = {
        OR: [
          {
            register_no: { contains: search, mode: "insensitive" },
          },
          {
            vin_no: { contains: search, mode: "insensitive" },
          },
        ],
      };
    }

    if (req?.query?.view) {
      query.orderBy = [
        {
          created_at:'desc'
        }
      ]
    } else {
      query.orderBy = [
        {
          receipts: {
            _count: 'desc'
          }
        }
      ]
    }

    // const data = await prisma.bus_master.findMany(query);
    const [data, count] = await prisma.$transaction([
      prisma.bus_master.findMany(query) as any,
      prisma.bus_master.count(),
    ]);

    await Promise.all(
      data.map(async (item: any) => {
        const busData: any[] = await prisma.$queryRawUnsafe(`
          select bus_id, sum(amount)::INT as total_collection ,date, bm.status ,receipts.conductor_id 
          from receipts 
          LEFT JOIN bus_master as bm ON receipts.bus_id = bm.register_no
          LEFT JOIN conductor_master as cm ON receipts.conductor_id = cm.cunique_id
          where bus_id = '${item?.register_no}'
          ${(from_date && to_date) ? `and date between '${from_date}' and '${to_date}'` : ''}
          group by bus_id, date, bm.status, receipts.conductor_id 
          order by date ASC
        `)

        await Promise.all(
          busData.map(async (bus: any) => {
            const date = new Date(bus?.date);
            const formattedDate = date.toISOString().split('T')[0];
            const receiptBreakup: any[] = await prisma.$queryRawUnsafe(`
              select conductor_id,amount::INT, count(amount)::INT, sum(amount)::INT,date::DATE from receipts
              WHERE bus_id = '${item?.register_no}' 
              and conductor_id = '${bus?.conductor_id}' 
              AND date = '${formattedDate}'
              group by conductor_id, amount, date
              ORDER BY date ASC
            `)

            bus.breakup = receiptBreakup

          })
        )

        const receiptData: any[] = await prisma.$queryRawUnsafe(`
          select sum(amount)::INT as total_bus_collection from receipts
          where bus_id = '${item?.register_no}'
          ${(from_date && to_date) ? `and date between '${from_date}' and '${to_date}'` : ''}
        `)

        item.bus_data = busData
        item.receipt_data = receiptData[0]

      })
    )

    return generateRes({ data, count, page, limit });
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
