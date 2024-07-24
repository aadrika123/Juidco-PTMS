import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const foreign_wrapper = async () => {
  await prisma.$queryRaw`CREATE EXTENSION IF NOT EXISTS postgres_fdw`;
  await prisma.$queryRaw`CREATE SERVER master_fdw FOREIGN DATA WRAPPER postgres_fdw OPTIONS (host '172.18.1.55', port '5432', dbname 'juidco_masters')`;
  await prisma.$queryRaw`CREATE USER MAPPING FOR postgres SERVER master_fdw OPTIONS (user 'postgres', password 'Secure@2023%3F')`;
  await prisma.$queryRaw`GRANT USAGE ON FOREIGN SERVER master_fdw TO postgres`;
  await prisma.$queryRaw`IMPORT FOREIGN SCHEMA public LIMIT TO (users, wf_roles, wf_roleusermaps, ulb_masters) FROM SERVER master_fdw INTO public`;
};
 
export default foreign_wrapper;
