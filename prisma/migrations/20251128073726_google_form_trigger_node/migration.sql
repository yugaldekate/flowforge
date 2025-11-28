/*
  Warnings:

  - You are about to drop the column `name` on the `Connection` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "NodeType" ADD VALUE 'GOOGLE_FORM_TRIGGER';

-- AlterTable
ALTER TABLE "Connection" DROP COLUMN "name";
