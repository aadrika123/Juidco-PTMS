/*
  Warnings:

  - A unique constraint covering the columns `[adhar_no]` on the table `onBoardedConductorDetails` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "onBoardedConductorDetails_adhar_no_key" ON "onBoardedConductorDetails"("adhar_no");
