-- AlterTable
ALTER TABLE "accounts_summary" ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "accounts_summary_pkey" PRIMARY KEY ("id");
