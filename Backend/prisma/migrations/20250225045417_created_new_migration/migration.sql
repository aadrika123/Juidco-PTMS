-- AlterTable
ALTER TABLE "bus_master" ALTER COLUMN "status" DROP NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'Not Scheduled';

-- AlterTable
ALTER TABLE "conductor_master" ALTER COLUMN "middle_name" DROP NOT NULL;
