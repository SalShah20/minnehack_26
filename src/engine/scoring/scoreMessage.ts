/**
 * Core scoring engine.
 *
 * Calculates:
 * - Heat score
 * - Repair score
 * - Flags
 * - XP delta
 *
 * Must remain deterministic.
 */

export type ScoreResult = {
    heat: number;   // 0 - 100 lower is better
    repair: number; // 0 - 100 higher is better
    heatTriggers: string[]; // what caused heat
    repairTriggers: string[];   // what caused repair
    combo: ComboType | null;    // special combo
    xp: number; 
};

export type ComboType = 
| "validation_ownership"
| "validation_boundary"
| "ownership_curiosity"
| "full_repair";

// Heat triggers
const HEAT_PATTERNS = {
    blame: [
        /\byou always\b/i,
         /\byou never\b/i,
        /\byou're so\b/i,
        /\byour fault\b/i,
        /\bbecause of you\b/i,
    ],
    absolutes: [
        /\bevery time\b/i,
        /\ball the time\b/i,
        /\bnever once\b/i,
    ],
    accusations: [
        /\byou don't care\b/i,
        /\byou're lying\b/i,
        /\byou ignored\b/i,
        /\byou're being\b/i,
    ], 
    aggressive: [
      /\bwhatever\b/i,
        /\bfine\b$/i,  // "Fine." as standalone
        /\bseriously\?/i,
        /\bunbelievable\b/i,  
    ],
    threats: [
        /\bif you don't\b/i,
        /\bor else\b/i,
        /\bi'm done\b/i,
        /\bthis is over\b/i,
    ],
};

// Repair triggers
const REPAIR_PATTERNS = {
    validation: [
        /\bi understand\b/i,
        /\bi hear you\b/i,
        /\bi get (it|that)\b/i,
        /\bthat makes sense\b/i,
        /\bi can see (why|how)\b/i,
        /\byou're right\b/i,
    ],
    ownership: [
        /\bi (should have|could have)\b/i,
        /\bi didn't mean to\b/i,
        /\bi apologize\b/i,
        /\bi'm sorry\b/i,
        /\bmy (bad|mistake)\b/i,
        /\bi was wrong\b/i,
        /\bi messed up\b/i,
    ],
    curiosity: [
        /\bcan you help me understand\b/i,
        /\bwhat did you mean\b/i,
        /\bcan we talk about\b/i,
        /\bhow can we\b/i,
        /\bwhat would work for you\b/i,
    ],
    boundaries: [
         /\bi need\b/i,
        /\bcan we (agree|try)\b/i,
        /\bi'd like (to|us to)\b/i,
        /\bgoing forward\b/i,
        /\bmoving forward\b/i,
    ],
    nextSteps: [
        /\blet's\b/i,
        /\bcan we schedule\b/i,
        /\bhow about we\b/i,
        /\bwould you be open to\b/i,
    ],
};

/**
 * Score a message
 */
export function scoreMessage(message: string): ScoreResult {
    const normalized = message.toLowerCase().trim();

    let heat = 0;
    let repair = 100;
    const heatTriggers: string[] = [];
    const repairTriggers: string[] = [];

    for (const [category, patterns] of Object.entries(HEAT_PATTERNS)) {
        for (const pattern of patterns) {
            if (pattern.test(normalized)) {
                heat += getHeatPenalty(category);
                heatTriggers.push(getHeatLabel(category));
                break; // only count category once
            }
        }
    }

    const detectedCategories = new Set<string>();
    for (const [category, patterns] of Object.entries(REPAIR_PATTERNS)) {
        for (const pattern of patterns) {
            if (pattern.test(normalized)) {
                repair += getRepairBonus(category);
                repairTriggers.push(getRepairLabel(category));
                detectedCategories.add(category);
                break;
            }
        }
    }

    const combo = detectCombo(detectedCategories);

    if (combo) {
        repair += getComboBonus(combo);
    }

    // Cap scores at 0-100
    heat = Math.min(100, Math.max(0, heat));
    repair = Math.min(100, Math.max(0, repair));

    const xp = calculateBaseXP(heat, repair);

    return {
        heat,
        repair,
        heatTriggers: [...new Set(heatTriggers)],
        repairTriggers: [...new Set(repairTriggers)],
        combo,
        xp,
    };
}

function getHeatPenalty(category: string): number {
    const penalties: Record<string, number> = {
        blame: 25,
        absolutes: 20,
        accusations: 30,
        aggressive: 15,
        threats: 40,
    };
    return penalties[category] || 10;
}

function getHeatLabel(category: string): string {
    const labels: Record<string, string> = {
        blame: "Blame language",
        absolutes: "Absolute statements",
        accusations: "Accusations",
        aggressive: "Aggressive tone",
        threats: "Threats/ultimatums",
    };
    return labels[category] || category;
}

function getRepairBonus(category: string): number {
    const bonuses: Record<string, number> = {
        validation: 25,
        ownership: 30,
        curiosity: 20,
        boundaries: 20,
        nextSteps: 15,
    };
    return bonuses[category] || 10;
}

function getRepairLabel(category: string): string {
    const labels: Record<string, string> = {
        validation: "Validation",
        ownership: "Ownership",
        curiosity: "Curiosity",
        boundaries: "Healthy boundary",
        nextSteps: "Concrete next step",
    };
    return labels[category] || category;
}

function detectCombo(categories: Set<string>): ComboType | null {
    const hasValidation = categories.has("validation");
    const hasOwnership = categories.has("ownership");
    const hasBoundary = categories.has("boundaries");
    const hasCuriosity = categories.has("curiosity");

    if (hasValidation && hasOwnership && (hasBoundary || hasCuriosity)) {
        return "full_repair";
    }

    if (hasValidation && hasOwnership) {
        return "validation_ownership";
    }

    if (hasValidation && hasBoundary) {
        return "validation_boundary";
    }

    if (hasOwnership && hasCuriosity) {
        return "ownership_curiosity";
    }

    return null;
}

function getComboBonus(combo: ComboType): number {
    const bonuses: Record<ComboType, number> = {
        validation_ownership: 15,
        validation_boundary: 15,
        ownership_curiosity: 15,
        full_repair: 25,
    };
    return bonuses[combo] || 0;
}

function calculateBaseXP(heat: number, repair: number): number {
    const repairXP = Math.round(repair*0.5);
    const heatBonus = heat < 30 ? 10 : 0;

    return repairXP + heatBonus;
}