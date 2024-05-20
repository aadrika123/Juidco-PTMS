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

    if (isExistingConductor) {
      return generateRes({
        error_type: "VALIDATION",
        validation_error: "Already Exist",
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

  getAllConductorList = async () => {
    const query: Prisma.conductor_masterFindManyArgs = {
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

    const data = await prisma.conductor_master.findMany(query);
    return generateRes(data);
  };
}

export default ConductorOnBoarding;
