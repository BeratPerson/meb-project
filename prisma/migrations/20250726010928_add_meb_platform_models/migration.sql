/*
  Warnings:

  - A unique constraint covering the columns `[tcKimlikNo]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('MEB_YONETICI', 'BURSIYER', 'MENTOR');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "tcKimlikNo" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "userRole" "UserRole" NOT NULL DEFAULT 'BURSIYER';

-- CreateTable
CREATE TABLE "BursiyerProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bursiyerYili" INTEGER NOT NULL,
    "alan" TEXT NOT NULL,
    "altAlan" TEXT,
    "tercihSira" INTEGER,
    "lisansUniversite" TEXT,
    "lisansBolum" TEXT,
    "yuksekLisansUniversite" TEXT,
    "yuksekLisansBolum" TEXT,
    "hedefUlke" TEXT,
    "hedefUniversite" TEXT,
    "hedefBolum" TEXT,
    "mentorArama" BOOLEAN NOT NULL DEFAULT true,
    "mentorIletisim" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BursiyerProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MentorProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "eskiBursiyerYili" INTEGER NOT NULL,
    "alan" TEXT NOT NULL,
    "altAlan" TEXT,
    "doktoraUniversite" TEXT NOT NULL,
    "doktoraBolum" TEXT NOT NULL,
    "doktoraYili" INTEGER NOT NULL,
    "doktoraBitisYili" INTEGER,
    "tezBasligi" TEXT NOT NULL,
    "tezDanismani" TEXT,
    "guncelGorev" TEXT NOT NULL,
    "guncelPozisyon" TEXT NOT NULL,
    "guncelKurum" TEXT NOT NULL,
    "guncelUlke" TEXT NOT NULL,
    "linkedinUrl" TEXT,
    "orcidId" TEXT,
    "websiteUrl" TEXT,
    "mentorlukAktif" BOOLEAN NOT NULL DEFAULT true,
    "mentorlukAlanlari" TEXT[],
    "maxMenteeSayisi" INTEGER NOT NULL DEFAULT 5,
    "mevcutMenteeSayisi" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MentorProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResearchArea" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResearchArea_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "University" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT,
    "website" TEXT,
    "logo" TEXT,
    "qsRanking" INTEGER,
    "timesRanking" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "University_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DoctoralProgram" (
    "id" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "subField" TEXT,
    "website" TEXT,
    "language" TEXT,
    "duration" TEXT,
    "tuition" TEXT,
    "requirements" TEXT,
    "facultyCount" INTEGER,
    "labCount" INTEGER,
    "publicationCount" INTEGER,
    "apiSource" TEXT,
    "apiData" JSONB,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DoctoralProgram_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemSettings" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SystemSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BursiyerProfileToResearchArea" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_MentorProfileToResearchArea" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "BursiyerProfile_userId_key" ON "BursiyerProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "MentorProfile_userId_key" ON "MentorProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ResearchArea_name_key" ON "ResearchArea"("name");

-- CreateIndex
CREATE UNIQUE INDEX "University_name_country_key" ON "University"("name", "country");

-- CreateIndex
CREATE UNIQUE INDEX "SystemSettings_key_key" ON "SystemSettings"("key");

-- CreateIndex
CREATE UNIQUE INDEX "_BursiyerProfileToResearchArea_AB_unique" ON "_BursiyerProfileToResearchArea"("A", "B");

-- CreateIndex
CREATE INDEX "_BursiyerProfileToResearchArea_B_index" ON "_BursiyerProfileToResearchArea"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MentorProfileToResearchArea_AB_unique" ON "_MentorProfileToResearchArea"("A", "B");

-- CreateIndex
CREATE INDEX "_MentorProfileToResearchArea_B_index" ON "_MentorProfileToResearchArea"("B");

-- CreateIndex
CREATE UNIQUE INDEX "User_tcKimlikNo_key" ON "User"("tcKimlikNo");

-- AddForeignKey
ALTER TABLE "BursiyerProfile" ADD CONSTRAINT "BursiyerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MentorProfile" ADD CONSTRAINT "MentorProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctoralProgram" ADD CONSTRAINT "DoctoralProgram_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BursiyerProfileToResearchArea" ADD CONSTRAINT "_BursiyerProfileToResearchArea_A_fkey" FOREIGN KEY ("A") REFERENCES "BursiyerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BursiyerProfileToResearchArea" ADD CONSTRAINT "_BursiyerProfileToResearchArea_B_fkey" FOREIGN KEY ("B") REFERENCES "ResearchArea"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MentorProfileToResearchArea" ADD CONSTRAINT "_MentorProfileToResearchArea_A_fkey" FOREIGN KEY ("A") REFERENCES "MentorProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MentorProfileToResearchArea" ADD CONSTRAINT "_MentorProfileToResearchArea_B_fkey" FOREIGN KEY ("B") REFERENCES "ResearchArea"("id") ON DELETE CASCADE ON UPDATE CASCADE;
