-- CreateTable
CREATE TABLE "onBoardedBusDetails" (
    "id" SERIAL NOT NULL,
    "register_no" TEXT NOT NULL,
    "vin_no" TEXT NOT NULL,
    "pollution_doc" TEXT NOT NULL,
    "taxCopy_doc" TEXT NOT NULL,
    "registrationCert_doc" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "onBoardedBusDetails_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "onBoardedBusDetails_vin_no_key" ON "onBoardedBusDetails"("vin_no");
