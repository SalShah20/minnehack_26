/**
 * Achievements Engine
 *
 * Defines badge unlock conditions.
 *
 * Example achievements:
 * - First Repair
 * - No Absolutes
 * - Boundary Builder
 * - Repair Combo
 * - Rupture Recovery
 *
 * Exports:
 * - checkAchievements(userStats)
 * - getUnlockedAchievements()
 *
 * Pure logic — no UI code.
 */

export type Achievement = {
  id: string;
  title: string;
  description: string;
};

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_repair",
    title: "First Repair",
    description: "Completed your first repair.",
  },
  {
    id: "no_absolutes",
    title: "No Absolutes",
    description: "Avoided absolute words.",
  },
  {
    id: "boundary_builder",
    title: "Boundary Builder",
    description: "Set a respectful boundary.",
  },
  {
    id: "repair_combo",
    title: "Repair Combo",
    description: "Gained a repair combo.",
  },
  {
    id: "rupture_recovery",
    title: "Rupture Recovery",
    description: "Recovered after escalation.",
  },
];

export function checkAchievements({
  totalXP,
  comboTriggered,
  heatScore,
}: {
  totalXP: number;
  comboTriggered: boolean;
  heatScore: number;
}) {
  const unlocked: Achievement[] = [];

  if (totalXP > 0) {
    unlocked.push(ACHIEVEMENTS[0]);
  }

  if (comboTriggered) {
    unlocked.push(ACHIEVEMENTS[1]);
  }

  if (heatScore < 20) {
    unlocked.push(ACHIEVEMENTS[2]);
  }

  return unlocked;
}

let unlockedData: Achievement[] = [];

export function checkAchievements(userStats: {
  totalXP: number;
  flags?: string[];
  comboTriggered?: boolean;
  ruptureRecovered?: boolean;
}) {
  const unlocked: Achievement[] = [];

  if (userStats.totalXP > 0)
    unlocked.push(ACHIEVEMENTS[0]);

  if (!userStats.flags?.includes("absolute"))
    unlocked.push(ACHIEVEMENTS[1]);

  if (userStats.flags?.includes("boundary"))
    unlocked.push(ACHIEVEMENTS[2]);

  if (userStats.comboTriggered)
    unlocked.push(ACHIEVEMENTS[3]);

  if (userStats.ruptureRecovered)
    unlocked.push(ACHIEVEMENTS[4]);

  unlockedData = unlocked;
  return unlocked;
}

export function getUnlockedAchievements() {
  return unlockedData;
}
