-- AlterTable
ALTER TABLE "bus_master" ADD COLUMN     "ulb_id" INTEGER NOT NULL DEFAULT 2;

-- AlterTable
ALTER TABLE "conductor_master" ADD COLUMN     "ulb_id" INTEGER NOT NULL DEFAULT 2;

-- AlterTable
ALTER TABLE "receipts" ADD COLUMN     "ulb_id" INTEGER NOT NULL DEFAULT 2;

-- AlterTable
ALTER TABLE "scheduler" ADD COLUMN     "ulb_id" INTEGER NOT NULL DEFAULT 2;
