import { Request } from "express";
import { Prisma, PrismaClient } from "@prisma/client";
import { generateRes } from "../../../../util/generateRes";

const prisma = new PrismaClient();

class BusConductorScheduleDao {
  createScheduleBusConductor = async (req: Request) => {
    const { bus_no, conductor_id, date, from_time, to_time, is_scheduled } =
      req.body;

    const { ulb_id } = req.body.auth

    const setDate = new Date(date).toISOString();

    const setFromTime = Number(from_time.replace(":", "").padStart(4, "0"));
    const setToTime = Number(to_time.replace(":", "").padStart(4, "0"));

    try {
      const isExistingSchedule = await prisma.$queryRawUnsafe<any[]>(`
    select * from scheduler where
    not ((${setFromTime} <= from_time and ${setToTime} <= from_time)
    or  (${setFromTime} >= to_time and ${setToTime} >= to_time)) 
    and bus_id = '${bus_no}' or conductor_id = '${conductor_id}'
    `);

      if (isExistingSchedule) {
        return generateRes({
          error_type: "VALIDATION",
          id: isExistingSchedule[0].id,
          validation_error: "Already Exist",
        });
      }
    } catch (err) {
      console.log(err);
    }

    const createNewSchedule = await prisma.scheduler.create({
      data: {
        bus_id: bus_no,
        conductor_id: conductor_id,
        date: setDate,
        from_time: setFromTime,
        to_time: setToTime,
        ulb_id: ulb_id
      },
    });

    if (createNewSchedule && is_scheduled) {
      await prisma.bus_master.update({
        data: {
          status: is_scheduled,
        },
        where: {
          register_no: bus_no,
        },
      });
    }

    return generateRes(createNewSchedule);
  };

  getScheduleBusConductor = async (req: Request) => {
    const page: number = Number(req.query.page);
    const limit: number = Number(req.query.limit);
    const search: string = String(req.query.search);
    const bus_no: string = String(req.query.bus_no);
    const conductor_id: string = String(req.query.conductor_id);
    const conductor_name: string = String(req.query.conductor_name);
    const from_date: string = String(req.query.from_date);
    const to_date: string = String(req.query.to_date);
  
    const { ulb_id } = req.body.auth;
  
    const query: Prisma.schedulerFindManyArgs = {
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        date: true,
        from_time: true,
        to_time: true,
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
      },
      where: { ulb_id }, // Always filter by ulb_id
    };
  
    // Accumulating the `where` conditions
    let whereConditions: Prisma.schedulerWhereInput = { ulb_id };
  
    // Handling the search filter
    if (search && search !== "undefined") {
      whereConditions = {
        ...whereConditions,
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
  
    // Handling the bus_no filter
    if (bus_no && bus_no !== "undefined") {
      whereConditions = {
        ...whereConditions,
        bus: {
          register_no: { equals: bus_no, mode: "insensitive" },
        },
      };
    }
  
    // Handling the date range filter for bus_no
    if (
      bus_no &&
      from_date &&
      to_date &&
      bus_no !== "undefined" &&
      from_date !== "undefined" &&
      to_date !== "undefined"
    ) {
      whereConditions = {
        ...whereConditions,
        bus: {
          register_no: { equals: bus_no, mode: "insensitive" },
        },
        date: {
          gte: new Date(from_date),
          lte: new Date(to_date),
        },
      };
    }
  
    // Handling the conductor_id filter
    if (conductor_id && conductor_id !== "undefined") {
      whereConditions = {
        ...whereConditions,
        conductor: {
          cunique_id: { equals: conductor_id, mode: "insensitive" },
        },
      };
    }
  
    // Handling the conductor_name filter
    if (conductor_name && conductor_name !== "undefined") {
      whereConditions = {
        ...whereConditions,
        conductor: {
          first_name: { contains: conductor_name, mode: "insensitive" },
        },
      };
    }
  
    // Finalizing the query where clause
    query.where = whereConditions;
  
    // Perform the transaction: fetching data and count
    const [data, count] = await prisma.$transaction([
      prisma.scheduler.findMany(query),
      prisma.scheduler.count({ where: whereConditions }),
    ]);
  
    // Return the response
    return generateRes({ data, count, page, limit });
  };
  

  updateScheduleBusConductor = async (req: Request) => {
    const { id, bus_no, conductor_id, date, from_time, to_time, is_scheduled } =
      req.body;

    const { ulb_id } = req.body.auth

    const setDate = new Date(date).toISOString();

    const setFromTime = Number(from_time.replace(":", "").padStart(4, "0"));
    const setToTime = Number(to_time.replace(":", "").padStart(4, "0"));

    console.log(id, conductor_id, bus_no, "ll");

    const query: Prisma.schedulerUpdateArgs = {
      data: {
        bus_id: bus_no,
        conductor_id: conductor_id,
        date: setDate,
        from_time: setFromTime,
        to_time: setToTime,
      },
      where: {
        id: parseInt(id),
      },
    };
    const data = await prisma.scheduler.update(query);

    if (data && is_scheduled) {
      await prisma.bus_master.update({
        data: {
          status: is_scheduled,
          ulb_id: ulb_id
        },
        where: {
          register_no: bus_no,
        },
      });
    }

    return generateRes(data);
  };

  deleteScheduleBusConductor = async (req: Request) => {
    const id = Number(req.body.id);
    const data = await prisma.scheduler.delete({
      where: {
        id: id,
      },
    });

    return generateRes(data);
  };

  todaySchedulesBuses = async (req: Request) => {
    const curr_date = String(req.body.curr_date);
    const { ulb_id } = req.body.auth
    const data = await prisma.$queryRawUnsafe(`
      SELECT 
        COUNT(DISTINCT sche.bus_id)::INT AS scheduled_buses,
        COUNT(DISTINCT bm.register_no)::INT - COUNT(DISTINCT sche.bus_id)::INT AS absent_buses
      FROM bus_master AS bm
      LEFT JOIN scheduler AS sche ON bm.register_no = sche.bus_id AND sche.date = '${curr_date}' and sche.ulb_id=${ulb_id}
      where bm.ulb_id=${ulb_id};
    `);

    return generateRes(data);
  };

  getBusScheduleConductor = async (req: Request) => {
    const { conductor_id, date, from_time, to_time } = req.body;
    const { ulb_id } = req.body.auth;

    const query: string = `
	    select conductor_id, bus_id, created_at, updated_at, from_time, to_time from scheduler
    	where ulb_id=${ulb_id} and conductor_id = '${conductor_id}' AND date = '${date}' and from_time <= '${from_time}' and '${to_time}' <= to_time;
    `;

    const data = await prisma.$queryRawUnsafe<any[]>(query);
    console.log(data);
    return generateRes(data);
  };
}
export default BusConductorScheduleDao;
