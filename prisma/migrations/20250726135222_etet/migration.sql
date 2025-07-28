/*
  Warnings:

  - A unique constraint covering the columns `[universityId,field]` on the table `DoctoralProgram` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "DoctoralProgram_universityId_field_key" ON "DoctoralProgram"("universityId", "field");
