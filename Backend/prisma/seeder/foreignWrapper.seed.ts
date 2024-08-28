import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const foreign_wrapper = async () => {
  await prisma.$queryRaw`CREATE EXTENSION IF NOT EXISTS postgres_fdw`;
  await prisma.$queryRaw`CREATE SERVER foreigndb_fdw FOREIGN DATA WRAPPER postgres_fdw OPTIONS (host 'localhost', port '5432', dbname 'juidco_masters')`;
  await prisma.$queryRaw`CREATE USER MAPPING FOR postgres SERVER foreigndb_fdw OPTIONS (user 'fdwuser', password 'S@cur@#??5')`;
  await prisma.$queryRaw`GRANT USAGE ON FOREIGN SERVER foreigndb_fdw TO postgres`;
  await prisma.$queryRaw`IMPORT FOREIGN SCHEMA public LIMIT TO (users, wf_roles, wf_roleusermaps, ulb_masters) FROM SERVER foreigndb_fdw INTO public`;
};

export default foreign_wrapper;
