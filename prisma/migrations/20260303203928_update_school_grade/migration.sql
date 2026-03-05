/*
  Warnings:

  - Added the required column `schoolId` to the `SchoolGrade` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "SchoolGrade_name_key";

-- AlterTable
ALTER TABLE "SchoolGrade" ADD COLUMN     "schoolId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "SchoolGrade" ADD CONSTRAINT "SchoolGrade_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
