/**
 * XP + Level progression system.
 *
 * Defines:
 * - XP per level
 * - Level thresholds
 */
export const XP_PER_LEVEL = 100;

export function calculateLevel(totalXP: number) {
  return Math.floor(totalXP / XP_PER_LEVEL) + 1;
}

export function xpToNextLevel(totalXP: number) {
    return XP_PER_LEVEL - (totalXP % XP_PER_LEVEL);
}

export function calculateXP({
  repairScore,
  heatScore,
  comboMultiplier = 1,
}: {
  repairScore: number;
  heatScore: number;
  comboMultiplier?: number;
}) {
  const baseXP = Math.max(0, repairScore - heatScore / 2);
  return Math.floor(baseXP * comboMultiplier);
}