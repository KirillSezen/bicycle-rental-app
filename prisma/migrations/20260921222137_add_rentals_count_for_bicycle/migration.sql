/*
  Warnings:

  - Made the column `endTime` on table `Rental` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Bicycle" ADD COLUMN     "rentalsCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Rental" ALTER COLUMN "endTime" SET NOT NULL;
