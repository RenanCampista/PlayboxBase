/*
  Warnings:

  - You are about to drop the column `rating` on the `Review` table. All the data in the column will be lost.
  - Added the required column `audioRating` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `averageRating` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `difficultyRating` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gameplayRating` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `historyRating` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `immersionRating` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `visualRating` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Game` ADD COLUMN `averageReviewRating` DOUBLE NULL;

-- AlterTable
ALTER TABLE `Review` DROP COLUMN `rating`,
    ADD COLUMN `audioRating` DOUBLE NOT NULL,
    ADD COLUMN `averageRating` DOUBLE NOT NULL,
    ADD COLUMN `difficultyRating` DOUBLE NOT NULL,
    ADD COLUMN `gameplayRating` DOUBLE NOT NULL,
    ADD COLUMN `historyRating` DOUBLE NOT NULL,
    ADD COLUMN `immersionRating` DOUBLE NOT NULL,
    ADD COLUMN `visualRating` DOUBLE NOT NULL;
