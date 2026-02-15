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
import type { ScoreResponse } from "@/src/types/api";

export type BuddyMood = "neutral" | "encouraging" | "proud" | "concerned" | "worried";

export function getBuddyMood(score: ScoreResponse): BuddyMood {
  if (score.heat > 70) return "worried";
  if (score.heat > 50) return "concerned";
  if (score.repair > 60) return "proud";
  if (score.repair > 30) return "encouraging";
  return "neutral";
}

export function getBuddyMessage(mood: BuddyMood): string {
  switch(mood) {
    case "proud":
      return "I'm impressed.";
    case "encouraging":
      return "You're getting better!";
    case "concerned":
      return "Be careful, that might escalate things.";
    case "worried":
      return "That could really hurt the situation.";
    default:
      return "Let's see how this lands.";
  }
}