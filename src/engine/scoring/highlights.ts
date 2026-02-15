/**
 * Identifies:
 * - "Hot" phrases (blame/absolutes)
 * - "Repair" phrases (validation/ownership)
 *
 * Used to visually underline text.
 */

export type Highlight = {
    text: string;
    type: "heat" | "repair";
    category: string;
    startIndex: number;
    endIndex: number;
};

export function findHighlights(message: string): Highlight[] {
    const highlights: Highlight[] = [];
    const normalized = message.toLowerCase();

    const heatPatterns = [
        {regex: /\byou always\b/gi, category: "blame"},
        { regex: /\byou never\b/gi, category: "blame" },
        { regex: /\byou don't care\b/gi, category: "accusations" },
        { regex: /\bi'm done\b/gi, category: "threats" },
    ];

    for (const {regex, category} of heatPatterns) {
        let match;
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

    const repairPatterns = [
        { regex: /\bi understand\b/gi, category: "validation" },
        { regex: /\bi'm sorry\b/gi, category: "ownership" },
        { regex: /\bcan we talk\b/gi, category: "curiosity" },
    ];

    for (const { regex, category } of repairPatterns) {
        let match;
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