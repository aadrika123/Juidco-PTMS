-- CreateTable
CREATE TABLE "busConductorMapping" (
    "id" SERIAL NOT NULL,
    "conductor_id" TEXT NOT NULL,
    "bus_no" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "busConductorMapping_pkey" PRIMARY KEY ("id")
);
