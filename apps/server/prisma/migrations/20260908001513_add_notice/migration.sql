-- CreateTable
CREATE TABLE "sys_notice" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "type" INTEGER NOT NULL DEFAULT 1,
    "content" TEXT,
    "status" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sys_notice_pkey" PRIMARY KEY ("id")
);
