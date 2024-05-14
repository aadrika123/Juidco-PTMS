-- CreateTable
CREATE TABLE "receipt" (
    "id" SERIAL NOT NULL,
    "receipt_no" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "conductor_id" TEXT NOT NULL,
    "rc_no" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "receipt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "onBoardedBusDetails" (
    "id" SERIAL NOT NULL,
    "register_no" TEXT NOT NULL,
    "vin_no" TEXT NOT NULL,
    "pollution_doc" JSONB NOT NULL,
    "taxCopy_doc" JSONB NOT NULL,
    "registrationCert_doc" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "onBoardedBusDetails_pkey" PRIMARY KEY ("id")
);

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
    "cUniqueId" TEXT NOT NULL,
    "adhar_doc" JSONB NOT NULL,
    "adhar_no" TEXT NOT NULL,
    "fitness_doc" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "onBoardedConductorDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "busConductorMapping" (
    "id" SERIAL NOT NULL,
    "conductor_id" TEXT NOT NULL,
    "bus_no" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "busConductorMapping_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "onBoardedBusDetails_vin_no_key" ON "onBoardedBusDetails"("vin_no");

-- CreateIndex
CREATE UNIQUE INDEX "onBoardedConductorDetails_emailId_key" ON "onBoardedConductorDetails"("emailId");

-- CreateIndex
CREATE UNIQUE INDEX "onBoardedConductorDetails_cUniqueId_key" ON "onBoardedConductorDetails"("cUniqueId");
