/*
  Warnings:

  - The `status` column on the `accounts_summary` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "accounts_summary" DROP COLUMN "status",
ADD COLUMN     "status" INTEGER DEFAULT 0;
