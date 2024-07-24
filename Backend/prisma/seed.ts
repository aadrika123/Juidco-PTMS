import { PrismaClient } from "@prisma/client";
import foreign_wrapper from "./seeder/foreignWrapper.seed";
const prisma = new PrismaClient();

async function main() {
  setTimeout(async () => {
    await foreign_wrapper();
  }, 3000);
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    // process.exit(1)
  });
