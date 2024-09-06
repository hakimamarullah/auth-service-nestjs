-- AlterTable
ALTER TABLE "path_allowed" ALTER COLUMN "role_id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "user_roles" ALTER COLUMN "role_id" DROP DEFAULT,
ALTER COLUMN "user_id" DROP DEFAULT;
