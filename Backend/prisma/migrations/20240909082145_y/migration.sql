/*
  Warnings:

  - The primary key for the `accounts_summary` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `accounts_summary` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "accounts_summary" DROP CONSTRAINT "accounts_summary_pkey",
DROP COLUMN "id";
