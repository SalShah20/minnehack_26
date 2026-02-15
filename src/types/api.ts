/**
 * Shared API response types.
 *
 * Includes:
 * - ScoreResult
 * - RoleplayResult
 * - OptionResult
 */
export type ScenarioRealm = "Friend" | "Family" | "Partner" | "Work/School" | "Roommate";

export type DraftLabel = "Soft Repair" | "Boundary + Respect" | "Direct & Clear";

export type DraftOption = {
    label: DraftLabel;
    text: string;
    whyItWorks: string;
};

export type DraftOptionsResult = {
    options: DraftOption[];
};

export type RoleplayResult = {
    reply: string;
    stability: number;
};

export type Scenario = {
    scenario: {
        realm: ScenarioRealm;
        difficulty: 1 | 2 | 3 | 4 | 5;
        emotion: string;
        description: string;
    };
};

export type ScenarioResult = Scenario;

export type HighlightType = "heat" | "repair";

export type Highlight = {
    text: string;
    type: HighlightType;
    category: string;
    startIndex: number;
    endIndex: number;
};

export type ScoreResponse = {
    heat: number;
    repair: number;
    xpDelta: number;

    highlights: Highlight[];

    triggeredPhrases?: {
        heat: string[];
        repair: string[];
    };

    flags?: {
        hasThreats?: boolean;
        hasAbsolutes?: boolean;
        hasInsults?: boolean;
    };

    feedback?: string[];
};