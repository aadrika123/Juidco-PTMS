/*
  Warnings:

  - You are about to drop the column `time` on the `busConductorMapping` table. All the data in the column will be lost.
  - Added the required column `from_time` to the `busConductorMapping` table without a default value. This is not possible if the table is not empty.
  - Added the required column `to_time` to the `busConductorMapping` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "busConductorMapping" DROP COLUMN "time",
ADD COLUMN     "from_time" INTEGER NOT NULL,
ADD COLUMN     "to_time" INTEGER NOT NULL;
