-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Country" ADD VALUE 'Canada';
ALTER TYPE "Country" ADD VALUE 'Argentina';
ALTER TYPE "Country" ADD VALUE 'Germany';
ALTER TYPE "Country" ADD VALUE 'Mexico';
ALTER TYPE "Country" ADD VALUE 'Italy';
ALTER TYPE "Country" ADD VALUE 'Spain';
ALTER TYPE "Country" ADD VALUE 'India';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Title" ADD VALUE 'Manager';
ALTER TYPE "Title" ADD VALUE 'Engineer';
