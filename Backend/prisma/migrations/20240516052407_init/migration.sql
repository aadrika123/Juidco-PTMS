/*
  Warnings:

  - A unique constraint covering the columns `[register_no]` on the table `bus_master` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "scheduler" DROP CONSTRAINT "scheduler_bus_id_fkey";

-- AlterTable
ALTER TABLE "scheduler" ALTER COLUMN "bus_id" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "bus_master_register_no_key" ON "bus_master"("register_no");

-- AddForeignKey
ALTER TABLE "scheduler" ADD CONSTRAINT "scheduler_bus_id_fkey" FOREIGN KEY ("bus_id") REFERENCES "bus_master"("register_no") ON DELETE RESTRICT ON UPDATE CASCADE;
