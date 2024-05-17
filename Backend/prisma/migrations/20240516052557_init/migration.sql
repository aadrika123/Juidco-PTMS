-- DropForeignKey
ALTER TABLE "scheduler" DROP CONSTRAINT "scheduler_conductor_id_fkey";

-- AddForeignKey
ALTER TABLE "scheduler" ADD CONSTRAINT "scheduler_conductor_id_fkey" FOREIGN KEY ("conductor_id") REFERENCES "conductor_master"("cunique_id") ON DELETE RESTRICT ON UPDATE CASCADE;
