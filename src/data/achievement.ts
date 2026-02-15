import type { ScoreResponse } from "../types/api";

export type Achievement = 
    | "first_repair"
    | "low_heat_master"
    | "validation_pro"
    | "ownership_hero"
    | "full_repair_combo"
    | "three_streak";

export type AchievementResult = {
    unlocked: Achievement[];
};

export function evaluateAchievements(
    score: ScoreResponse,
    previousScores: ScoreResponse[]
): AchievementResult {
    const unlocked: Achievement[] = [];

    if (score.repair > 20) {
        unlocked.push("first_repair");
    }

    if (score.heat < 20) {
        unlocked.push("low_heat_master");
    }

    if (score.triggeredPhrases?.repair.includes("Validation")) {
        unlocked.push("validation_pro");
    }

    return {unlocked};
}