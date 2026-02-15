/**
 * XP + Level progression system.
 *
 * Defines:
 * - XP per level
 * - Level thresholds
 */

export type LevelInfo = {
  level: number;
  xpIntoLevel: number;
  xpForNextLevel: number;
  progressPercent: number;
}

export function calculateLevel(totalXP: number): LevelInfo {
  const baseXP = 100;
  const growthRate = 1.4;

  let level = 1;
  let xpRemaining = totalXP;
  let xpForNextLevel = baseXP;

  while (xpRemaining >= xpForNextLevel) {
    xpRemaining -= xpForNextLevel;
    level++;
    xpForNextLevel = Math.round(baseXP * Math.pow(growthRate, level -1));
  }

  const progressPercent = Math.round((xpRemaining/xpForNextLevel) * 100);

  return {
    level,
    xpIntoLevel: xpRemaining,
    xpForNextLevel,
    progressPercent,
  };
}