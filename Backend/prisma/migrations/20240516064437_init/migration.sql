-- DropForeignKey
ALTER TABLE "receipts" DROP CONSTRAINT "receipts_bus_id_fkey";

-- AlterTable
ALTER TABLE "receipts" ALTER COLUMN "bus_id" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "receipts" ADD CONSTRAINT "receipts_bus_id_fkey" FOREIGN KEY ("bus_id") REFERENCES "bus_master"("register_no") ON DELETE RESTRICT ON UPDATE CASCADE;
