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

    const query: Prisma.bus_masterFindManyArgs = {
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        register_no: true,
        vin_no: true,
      },
    };

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

    // const data = await prisma.bus_master.findMany(query);
    const [data, count] = await prisma.$transaction([
      prisma.bus_master.findMany(query),
      prisma.bus_master.count(),
    ]);
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
}

export default BusOnboarding;
