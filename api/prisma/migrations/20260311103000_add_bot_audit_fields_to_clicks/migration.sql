-- AlterTable
ALTER TABLE "clicks"
  ADD COLUMN "bot_score" INTEGER,
  ADD COLUMN "bot_signals" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN "asn_number" INTEGER,
  ADD COLUMN "asn_org" TEXT;

-- CreateIndex
CREATE INDEX "clicks_isBot_idx" ON "clicks"("isBot");
