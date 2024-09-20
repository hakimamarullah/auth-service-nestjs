-- CreateEnum
CREATE TYPE "ResetTokenStatus" AS ENUM ('ACTIVE', 'USED', 'EXPIRED');

-- CreateTable
CREATE TABLE "reset_token" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "email" VARCHAR(60) NOT NULL,
    "status" "ResetTokenStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reset_token_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "reset_token_token_key" ON "reset_token"("token");

-- CreateIndex
CREATE INDEX "reset_token_email_idx" ON "reset_token"("email");
