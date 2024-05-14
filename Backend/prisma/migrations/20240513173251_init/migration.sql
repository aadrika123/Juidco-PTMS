-- CreateTable
CREATE TABLE "onBoardedConductorDetails" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "middleName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "age" TEXT NOT NULL,
    "bloodGrp" TEXT NOT NULL,
    "mobileNo" TEXT NOT NULL,
    "emergencyMobNo" TEXT NOT NULL,
    "emailId" TEXT NOT NULL,
    "adhar_doc" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "onBoardedConductorDetails_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "onBoardedConductorDetails_emailId_key" ON "onBoardedConductorDetails"("emailId");
