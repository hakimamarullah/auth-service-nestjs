/*
  Warnings:

  - The primary key for the `path_allowed` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createBy` on the `path_allowed` table. All the data in the column will be lost.
  - You are about to drop the column `roleId` on the `path_allowed` table. All the data in the column will be lost.
  - You are about to drop the column `createBy` on the `role` table. All the data in the column will be lost.
  - The primary key for the `user_roles` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `assignedAt` on the `user_roles` table. All the data in the column will be lost.
  - You are about to drop the column `assignedBy` on the `user_roles` table. All the data in the column will be lost.
  - You are about to drop the column `roleId` on the `user_roles` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `user_roles` table. All the data in the column will be lost.
  - Added the required column `role_id` to the `path_allowed` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role_id` to the `user_roles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `user_roles` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "path_allowed" DROP CONSTRAINT "path_allowed_roleId_fkey";

-- DropForeignKey
ALTER TABLE "user_roles" DROP CONSTRAINT "user_roles_roleId_fkey";

-- DropForeignKey
ALTER TABLE "user_roles" DROP CONSTRAINT "user_roles_userId_fkey";

-- AlterTable
ALTER TABLE "path_allowed" DROP CONSTRAINT "path_allowed_pkey",
DROP COLUMN "createBy",
DROP COLUMN "roleId",
ADD COLUMN     "create_by" VARCHAR(30),
ADD COLUMN     "role_id" INTEGER NOT NULL default 1,
ADD CONSTRAINT "path_allowed_pkey" PRIMARY KEY ("role_id", "path");

-- AlterTable
ALTER TABLE "role" DROP COLUMN "createBy",
ADD COLUMN     "create_by" VARCHAR(30);

-- AlterTable
ALTER TABLE "user_roles" DROP CONSTRAINT "user_roles_pkey",
DROP COLUMN "assignedAt",
DROP COLUMN "assignedBy",
DROP COLUMN "roleId",
DROP COLUMN "userId",
ADD COLUMN     "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "assigned_by" VARCHAR(30),
ADD COLUMN     "role_id" INTEGER NOT NULL default 1,
ADD COLUMN     "user_id" INTEGER NOT NULL default 3,
ADD CONSTRAINT "user_roles_pkey" PRIMARY KEY ("user_id", "role_id");

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "path_allowed" ADD CONSTRAINT "path_allowed_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE;
