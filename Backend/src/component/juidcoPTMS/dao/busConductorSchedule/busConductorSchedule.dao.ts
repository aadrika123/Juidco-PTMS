import { Request } from "express";
import { Prisma, PrismaClient } from "@prisma/client";
import { generateRes } from "../../../../util/generateRes";

const prisma = new PrismaClient();

class BusConductorScheduleDao {
  createScheduleBusConductor = async (req: Request) => {
    const { bus_no, conductor_id, date, from_time, to_time } = req.body;

    const setDate = new Date(date).toISOString();

    const setFromTime = Number(from_time.replace(":", "").padStart(4, "0"));
    const setToTime = Number(to_time.replace(":", "").padStart(4, "0"));

    //checking if schedule already exist
    const isExistingSchedule = await prisma.scheduler.findMany({
      where: {
        bus_id: bus_no,
        conductor_id: conductor_id,
        date: setDate,
        from_time: setFromTime,
        to_time: setToTime,
      },
    });

    if (isExistingSchedule) {
      return generateRes({
        error_type: "VALIDATION",
        validation_error: "Already Exist",
      });
    }

    const createNewSchedule = await prisma.scheduler.create({
      data: {
        bus_id: bus_no,
        conductor_id: conductor_id,
        date: setDate,
        from_time: setFromTime,
        to_time: setToTime,
      },
    });

    return generateRes(createNewSchedule);
  };

  getScheduleBusConductor = async (req: Request) => {
    const page: number = Number(req.query.page);
    const limit: number = Number(req.query.limit);
    const search: string = String(req.query.search);
    const bus_no: string = String(req.query.bus_no);
    const conductor_id: string = String(req.query.conductor_id);
    const conductor_name: string = String(req.query.conductor_name);

    const query: Prisma.schedulerFindManyArgs = {
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        date: true,
        from_time: true,
        to_time: true,
        bus: true,
        conductor: true,
      },
    };

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

    if (bus_no !== "" && typeof bus_no === "string" && bus_no !== "undefined") {
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

    if (conductor_id !== "" && conductor_id !== "undefined") {
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

    if (
      conductor_name !== "" &&
      typeof conductor_name === "string" &&
      conductor_name !== "undefined"
    ) {
      query.where = {
        OR: [
          {
            conductor: {
              first_name: { equals: conductor_name, mode: "insensitive" },
            },
          },
        ],
      };
    }
    const [data, count] = await prisma.$transaction([
      prisma.scheduler.findMany(query),
      prisma.scheduler.count(),
    ]);
    return generateRes({ data, count, page, limit });
  };

  updateScheduleBusConductor = async (req: Request) => {
    const { id, bus_no, conductor_id, date, from_time, to_time } = req.body;

    const setDate = new Date(date).toISOString();

    const setFromTime = Number(from_time.replace(":", "").padStart(4, "0"));
    const setToTime = Number(to_time.replace(":", "").padStart(4, "0"));

    const query: Prisma.schedulerUpdateArgs = {
      data: {
        bus_id: bus_no,
        conductor_id: conductor_id,
        date: setDate,
        from_time: setFromTime,
        to_time: setToTime,
      },
      where: id,
    };
    const data = await prisma.scheduler.update(query);
    return generateRes(data);
  };
}
export default BusConductorScheduleDao;
