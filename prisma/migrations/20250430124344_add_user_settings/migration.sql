/*
  Warnings:

  - You are about to drop the column `createdAt` on the `UserSettings` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `UserSettings` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserSettings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "weightGoal" REAL,
    "lossRate" REAL,
    "carbFatRatio" REAL,
    "bufferValue" REAL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "UserSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_UserSettings" ("bufferValue", "carbFatRatio", "id", "lossRate", "userId", "weightGoal") SELECT "bufferValue", "carbFatRatio", "id", "lossRate", "userId", "weightGoal" FROM "UserSettings";
DROP TABLE "UserSettings";
ALTER TABLE "new_UserSettings" RENAME TO "UserSettings";
CREATE UNIQUE INDEX "UserSettings_userId_key" ON "UserSettings"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
