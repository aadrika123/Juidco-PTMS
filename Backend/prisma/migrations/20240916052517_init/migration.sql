-- CreateTable
CREATE TABLE "accounts_summary" (
    "conductor_id" TEXT NOT NULL,
    "transaction_id" TEXT NOT NULL,
    "total_amount" INTEGER NOT NULL,
    "date" DATE NOT NULL,
    "time" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "transaction_type" TEXT NOT NULL,
    "conductor_name" TEXT NOT NULL,
    "bus_id" TEXT NOT NULL,
    "status" INTEGER DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "accounts_summary_transaction_id_key" ON "accounts_summary"("transaction_id");
