/**
 * Identifies:
 * - "Hot" phrases (blame/absolutes)
 * - "Repair" phrases (validation/ownership)
 *
 * Used to visually underline text.
 */

import { HEAT_PATTERNS, REPAIR_PATTERNS } from "@/src/data/phrases";

export type Highlight = {
    text: string;
    type: "heat" | "repair";
    category: string;
    startIndex: number;
    endIndex: number;
};

export function findHighlights(message: string): Highlight[] {
    const highlights: Highlight[] = [];

    for (const {regex, category} of HEAT_PATTERNS) {
        regex.lastIndex = 0;
        let match: RegExpExecArray | null;
        while ((match = regex.exec(message)) !== null) {
            highlights.push({
                text: match[0],
                type: "heat",
                category,
                startIndex: match.index,
                endIndex: match.index + match[0].length,
            });
        }
    }

    for (const { regex, category } of REPAIR_PATTERNS) {
        regex.lastIndex = 0;
        let match: RegExpExecArray | null;
        while ((match = regex.exec(message)) != null) {
            highlights.push({
                text: match[0],
                type: "repair",
                category,
                startIndex: match.index,
                endIndex: match.index + match[0].length,
            });
        }
    }

    return highlights.sort((a, b) => a.startIndex - b.startIndex);
}

/**
 * List of phrases that affected the scoring
 */
export function getTriggeredPhrases(message: string): {
    heat: string[];
    repair: string[];
} {
    const highlights = findHighlights(message);

    return {
        heat: highlights.filter(h => h.type === "heat").map(h => h.text),
        repair: highlights.filter(h => h.type === "repair").map(h => h.text),
    };
}