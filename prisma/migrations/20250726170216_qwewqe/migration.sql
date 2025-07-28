/*
  Warnings:

  - You are about to drop the `BursiyerProfile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DoctoralProgram` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MentorProfile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Message` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ResearchArea` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SystemSettings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `University` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_BursiyerProfileToResearchArea` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_MentorProfileToResearchArea` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BursiyerProfile" DROP CONSTRAINT "BursiyerProfile_userId_fkey";

-- DropForeignKey
ALTER TABLE "DoctoralProgram" DROP CONSTRAINT "DoctoralProgram_universityId_fkey";

-- DropForeignKey
ALTER TABLE "MentorProfile" DROP CONSTRAINT "MentorProfile_userId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_receiverId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_senderId_fkey";

-- DropForeignKey
ALTER TABLE "_BursiyerProfileToResearchArea" DROP CONSTRAINT "_BursiyerProfileToResearchArea_A_fkey";

-- DropForeignKey
ALTER TABLE "_BursiyerProfileToResearchArea" DROP CONSTRAINT "_BursiyerProfileToResearchArea_B_fkey";

-- DropForeignKey
ALTER TABLE "_MentorProfileToResearchArea" DROP CONSTRAINT "_MentorProfileToResearchArea_A_fkey";

-- DropForeignKey
ALTER TABLE "_MentorProfileToResearchArea" DROP CONSTRAINT "_MentorProfileToResearchArea_B_fkey";

-- DropTable
DROP TABLE "BursiyerProfile";

-- DropTable
DROP TABLE "DoctoralProgram";

-- DropTable
DROP TABLE "MentorProfile";

-- DropTable
DROP TABLE "Message";

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
