/*
  Warnings:

  - You are about to drop the column `tcKimlikNo` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `userRole` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `BursiyerProfile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MentorProfile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Message` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BursiyerProfile" DROP CONSTRAINT "BursiyerProfile_userId_fkey";

-- DropForeignKey
ALTER TABLE "MentorProfile" DROP CONSTRAINT "MentorProfile_userId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_receiverId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_senderId_fkey";

-- DropIndex
DROP INDEX "User_tcKimlikNo_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "tcKimlikNo",
DROP COLUMN "userRole";

-- DropTable
DROP TABLE "BursiyerProfile";

-- DropTable
DROP TABLE "MentorProfile";

-- DropTable
DROP TABLE "Message";

-- DropEnum
DROP TYPE "UserRole";
