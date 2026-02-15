/**
 * Calculates improvement bonus between attempts.
 */

import { ScoreResult } from "./scoreMessage";

export type ImprovementResult = {
    heatImproved: boolean;
    repairImproved: boolean;
    heatDelta: number; // Negative = improvement
    repairDelta: number; // Positive = improvement
    bonusXP: number,
    improvementLevel: string,
};

/**
 * Compare two scores
 * @param previousScore
 * @param newScore
 */
export function calculateImprovement(
    previousScore: ScoreResult,
    newScore: ScoreResult
): ImprovementResult {
    const heatDelta = newScore.heat - previousScore.heat;
    const repairDelta = newScore.repair - previousScore.repair;

    const heatImproved = heatDelta < 0;
    const repairImproved = repairDelta > 0;

    let bonusXP = 0;
    
    if (heatImproved) {
        bonusXP += Math.abs(heatDelta) * 0.3;
    }

    if (repairImproved) {
        bonusXP += repairDelta * 0.5;
    }

    bonusXP = Math.round(bonusXP);

    const improvementLevel = getImprovementLevel(heatImproved, repairImproved, heatDelta, repairDelta);

    return {
        heatImproved,
        repairImproved,
        heatDelta,
        repairDelta,
        bonusXP,
        improvementLevel,
    };
}

function getImprovementLevel(
    heatImproved: boolean,
    repairImproved: boolean,
    heatDelta: number,
    repairDelta: number
): "none" | "slight" | "good" | "great" {
    if (!heatImproved && !repairImproved)
        return "none";

    if (heatImproved && repairImproved && Math.abs(heatDelta) > 20 && repairDelta > 20) {
        return "great";
    }

    if (heatImproved && repairImproved) {
        return "good";
    }

    if (Math.abs(heatDelta) > 30 || repairDelta > 30) {
        return "good";
    }

    return "slight";
}

export function getImprovementMessage(result: ImprovementResult): string {
    switch (result.improvementLevel) {
        case "great":
            return "Amazing improvement!";
        case "good":
            return "Nice work! You're getting better at this.";
        case "slight":
            return "You're on the right track. Keep working.";
        case "none":
            return "Try a different approach.";
    }
    return "";
}

