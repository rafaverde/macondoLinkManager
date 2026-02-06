-- AlterTable
ALTER TABLE "clicks" ADD COLUMN     "bot_reason" TEXT,
ADD COLUMN     "isBot" BOOLEAN NOT NULL DEFAULT false;
