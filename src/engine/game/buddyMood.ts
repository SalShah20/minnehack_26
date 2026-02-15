/**
 * Buddy mood state machine.
 *
 * Inputs:
 * - Heat
 * - Repair
 * - Stability
 *
 * Outputs:
 * - calm
 * - overheated
 * - recovering
 * - proud
 */

export type BuddyMood = "calm" | "overheated" | "recovering" | "proud"

export function getBuddyMood({
  heatScore,
  repairScore,
}: {
  heatScore: number;
  repairScore: number;
}): BuddyMood {
  if (heatScore > 70) return "overheated";
  if (repairScore > 80) return "proud";
  if (repairScore > heatScore) return "recovering";
  return "calm";
}