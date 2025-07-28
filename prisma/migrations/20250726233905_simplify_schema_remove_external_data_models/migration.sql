/*
  Warnings:

  - You are about to drop the column `mentorArama` on the `BursiyerProfile` table. All the data in the column will be lost.
  - You are about to drop the column `mentorIletisim` on the `BursiyerProfile` table. All the data in the column will be lost.
  - You are about to drop the column `read` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the `DoctoralProgram` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ResearchArea` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SystemSettings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `University` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_BursiyerProfileToResearchArea` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_MentorProfileToResearchArea` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "DoctoralProgram" DROP CONSTRAINT "DoctoralProgram_universityId_fkey";

-- DropForeignKey
ALTER TABLE "_BursiyerProfileToResearchArea" DROP CONSTRAINT "_BursiyerProfileToResearchArea_A_fkey";

-- DropForeignKey
ALTER TABLE "_BursiyerProfileToResearchArea" DROP CONSTRAINT "_BursiyerProfileToResearchArea_B_fkey";

-- DropForeignKey
ALTER TABLE "_MentorProfileToResearchArea" DROP CONSTRAINT "_MentorProfileToResearchArea_A_fkey";

-- DropForeignKey
ALTER TABLE "_MentorProfileToResearchArea" DROP CONSTRAINT "_MentorProfileToResearchArea_B_fkey";

-- AlterTable
ALTER TABLE "BursiyerProfile" DROP COLUMN "mentorArama",
DROP COLUMN "mentorIletisim";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "read",
DROP COLUMN "updatedAt",
ADD COLUMN     "isRead" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "DoctoralProgram";

-- DropTable
DROP TABLE "ResearchArea";

-- DropTable
DROP TABLE "SystemSettings";

-- DropTable
DROP TABLE "University";

-- DropTable
DROP TABLE "_BursiyerProfileToResearchArea";

-- DropTable
DROP TABLE "_MentorProfileToResearchArea";
