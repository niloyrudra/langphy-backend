import type { AchievementUnlockedEvent } from "@langphy/shared";
import { AchievementsRepo } from "../repos/achievement.repo.js";

export const handleAchievementsUnlocked = async ( event: AchievementUnlockedEvent ) => {
    try {
        // New Completion or redo -> replace performance
        await AchievementsRepo.upsert({
            icon: event.payload.icon,
            title: event.payload.title,
            description: event.payload.description,
            created_at: event.payload.occured_at
        });

        return {
            updated: true
        };

    }
    catch(error) {
        console.error("Achievements Service handleAchievementsUnlocked error:", error);
        return { updated: false };
    }
}