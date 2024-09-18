-- DropIndex
DROP INDEX "accounts_summary_transaction_id_key";

-- AlterTable
ALTER TABLE "receipts" ADD COLUMN     "transaction_id" TEXT;

-- AddForeignKey
ALTER TABLE "receipts" ADD CONSTRAINT "receipts_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "accounts_summary"("transaction_id") ON DELETE SET NULL ON UPDATE CASCADE;
