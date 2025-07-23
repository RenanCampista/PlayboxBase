-- AlterTable
ALTER TABLE `Review` MODIFY `audioRating` INTEGER NOT NULL,
    MODIFY `difficultyRating` INTEGER NOT NULL,
    MODIFY `gameplayRating` INTEGER NOT NULL,
    MODIFY `historyRating` INTEGER NOT NULL,
    MODIFY `immersionRating` INTEGER NOT NULL,
    MODIFY `visualRating` INTEGER NOT NULL;
