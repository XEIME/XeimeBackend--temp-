/*
  Warnings:

  - You are about to drop the column `createAt` on the `Mark` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[studentId,subjectId,trimester,year,type]` on the table `Mark` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Mark` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `Mark` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `Mark` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "MarkType" AS ENUM ('AC1', 'AC2', 'AC3', 'AT');

-- AlterTable
ALTER TABLE "Mark" DROP COLUMN "createAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "year" INTEGER NOT NULL,
DROP COLUMN "type",
ADD COLUMN     "type" "MarkType" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Mark_studentId_subjectId_trimester_year_type_key" ON "Mark"("studentId", "subjectId", "trimester", "year", "type");
