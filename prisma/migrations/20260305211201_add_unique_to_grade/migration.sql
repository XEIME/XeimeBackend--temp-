/*
  Warnings:

  - A unique constraint covering the columns `[name,schoolId]` on the table `SchoolGrade` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "SchoolGrade_name_schoolId_key" ON "SchoolGrade"("name", "schoolId");
