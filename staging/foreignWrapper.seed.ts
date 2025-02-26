import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const foreign_wrapper = async () => {
  await prisma.$queryRaw`CREATE EXTENSION IF NOT EXISTS postgres_fdw`;
<<<<<<< HEAD
  await prisma.$queryRaw`CREATE SERVER master_fdw FOREIGN DATA WRAPPER postgres_fdw OPTIONS (host '10.120.11.100', port '5432', dbname 'juidco_masters')`;
  await prisma.$queryRaw`CREATE USER MAPPING FOR postgres SERVER master_fdw OPTIONS (user 'postgres', password 'Perfect%40%23%40%23%23%29%40%3F')`;
=======
  await prisma.$queryRaw`CREATE SERVER master_fdw FOREIGN DATA WRAPPER postgres_fdw OPTIONS (host 'localhost', port '5432', dbname 'juidco_masters')`;
  await prisma.$queryRaw`CREATE USER MAPPING FOR postgres SERVER master_fdw OPTIONS (user 'postgres', password 'admin')`;
>>>>>>> refs/remotes/origin/main
  await prisma.$queryRaw`GRANT USAGE ON FOREIGN SERVER master_fdw TO postgres`;
  await prisma.$queryRaw`IMPORT FOREIGN SCHEMA public LIMIT TO (users, wf_roles, wf_roleusermaps, ulb_masters) FROM SERVER master_fdw INTO public`;
};
 
export default foreign_wrapper;
