-- DropForeignKey
ALTER TABLE "receipts" DROP CONSTRAINT "receipts_conductor_id_fkey";

-- DropForeignKey
ALTER TABLE "scheduler" DROP CONSTRAINT "scheduler_conductor_id_fkey";

-- AlterTable
ALTER TABLE "conductor_master" ALTER COLUMN "cunique_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "receipts" ALTER COLUMN "conductor_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "scheduler" ALTER COLUMN "conductor_id" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "scheduler" ADD CONSTRAINT "scheduler_conductor_id_fkey" FOREIGN KEY ("conductor_id") REFERENCES "conductor_master"("cunique_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receipts" ADD CONSTRAINT "receipts_conductor_id_fkey" FOREIGN KEY ("conductor_id") REFERENCES "conductor_master"("cunique_id") ON DELETE RESTRICT ON UPDATE CASCADE;
