-- CreateTable
CREATE TABLE "path_allowed" (
    "roleId" INTEGER NOT NULL,
    "path" VARCHAR(255) NOT NULL,

    CONSTRAINT "path_allowed_pkey" PRIMARY KEY ("roleId","path")
);

-- AddForeignKey
ALTER TABLE "path_allowed" ADD CONSTRAINT "path_allowed_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE;
