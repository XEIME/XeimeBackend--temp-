/*
  Warnings:

  - Added the required column `completedById` to the `ClassProgress` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ClassProgress" ADD COLUMN     "completedById" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "ClassProgress" ADD CONSTRAINT "ClassProgress_completedById_fkey" FOREIGN KEY ("completedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
