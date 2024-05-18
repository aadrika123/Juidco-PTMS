/*
  Warnings:

  - A unique constraint covering the columns `[email_id]` on the table `conductor_master` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "bus_master" ADD COLUMN "status" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "conductor_master_email_id_key" ON "conductor_master"("email_id");
