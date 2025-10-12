/*
  Warnings:

  - You are about to drop the column `finish_at` on the `event` table. All the data in the column will be lost.
  - You are about to drop the column `start_at` on the `event` table. All the data in the column will be lost.
  - Added the required column `end` to the `event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start` to the `event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "event" DROP COLUMN "finish_at",
DROP COLUMN "start_at",
ADD COLUMN     "end" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "start" TIMESTAMP(3) NOT NULL;
