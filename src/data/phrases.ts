/**
 * Sentence starters used by Repair Tools.
 *
 * Examples:
 * - Validation
 * - Ownership
 * - Boundary
 * - Curiosity
 */
export type PhraseType = "heat" | "repair";

export type PhrasePattern = {
    regex: RegExp;
    category: string;
    type: PhraseType;
    weight?: number;
};

export const HEAT_PATTERNS: PhrasePattern[] = [
    { regex: /\byou always\b/gi, category: "blame", type: "heat", weight: 2},
    { regex: /\byou never\b/gi, category: "blame", type: "heat", weight: 2},
    { regex: /\byou don't care\b/gi, category: "accusations", type: "heat", weight: 2},
    { regex: /\bi'm done\b/gi, category: "threats", type: "heat", weight: 3},
];

export const REPAIR_PATTERNS: PhrasePattern[] = [
  { regex: /\bi understand\b/gi, category: "validation", type: "repair", weight: 2 },
  { regex: /\bi'm sorry\b/gi, category: "ownership", type: "repair", weight: 2 },
  { regex: /\bcan we talk\b/gi, category: "curiosity", type: "repair", weight: 1 },
];

