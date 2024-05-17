-- CreateTable
CREATE TABLE "bus_master" (
    "id" SERIAL NOT NULL,
    "register_no" TEXT NOT NULL,
    "vin_no" TEXT NOT NULL,
    "pollution_doc" JSONB NOT NULL,
    "taxCopy_doc" JSONB NOT NULL,
    "registrationCert_doc" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bus_master_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conductor_master" (
    "id" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "middle_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "age" TEXT NOT NULL,
    "blood_grp" TEXT NOT NULL,
    "mobile_no" TEXT NOT NULL,
    "emergency_mob_no" TEXT NOT NULL,
    "email_id" TEXT NOT NULL,
    "cunique_id" INTEGER NOT NULL,
    "adhar_doc" JSONB NOT NULL,
    "adhar_no" TEXT NOT NULL,
    "fitness_doc" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "conductor_master_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scheduler" (
    "id" SERIAL NOT NULL,
    "conductor_id" INTEGER NOT NULL,
    "bus_id" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "from_time" INTEGER NOT NULL,
    "to_time" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "scheduler_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "receipts" (
    "id" SERIAL NOT NULL,
    "conductor_id" INTEGER NOT NULL,
    "bus_id" INTEGER NOT NULL,
    "receipt_no" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "date" DATE NOT NULL,
    "time" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "receipts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bus_master_vin_no_key" ON "bus_master"("vin_no");

-- CreateIndex
CREATE UNIQUE INDEX "conductor_master_cunique_id_key" ON "conductor_master"("cunique_id");

-- CreateIndex
CREATE UNIQUE INDEX "conductor_master_adhar_no_key" ON "conductor_master"("adhar_no");

-- CreateIndex
CREATE UNIQUE INDEX "receipts_receipt_no_key" ON "receipts"("receipt_no");

-- AddForeignKey
ALTER TABLE "scheduler" ADD CONSTRAINT "scheduler_conductor_id_fkey" FOREIGN KEY ("conductor_id") REFERENCES "conductor_master"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scheduler" ADD CONSTRAINT "scheduler_bus_id_fkey" FOREIGN KEY ("bus_id") REFERENCES "bus_master"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receipts" ADD CONSTRAINT "receipts_conductor_id_fkey" FOREIGN KEY ("conductor_id") REFERENCES "conductor_master"("cunique_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receipts" ADD CONSTRAINT "receipts_bus_id_fkey" FOREIGN KEY ("bus_id") REFERENCES "bus_master"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
