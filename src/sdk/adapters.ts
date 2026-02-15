/**
 * Convert raw LLM JSON outputs into app-friendly TypeScropt shapes
 */
import type { DraftOption, DraftOptionsResult, Scenario, RoleplayResult, ScenarioResult, ScenarioRealm} from "../types/api";

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

const asString = (v: unknown, fallback = ""): string =>
    typeof v === "string" ? v : fallback;

const asNumber = (v: unknown, fallback = 0): number => {
    if (typeof v === "number" && Number.isFinite(v)) 
        return v;
    if (typeof v === "string") {
        const n = Number(v);
        if (Number.isFinite(n))
            return n;
    }
    return fallback;
};

const normalizeWhitespace = (s: string) => s.replace(/\s+/g, " ").trim();

const isScenarioRealm = (v: unknown): v is ScenarioRealm => 
    v === "Friend" || v === "Family" || v === "Partner" || v === "Work/School" || v === "Roommate";

// Draft Options Adapter
type RawDraftOption = {
    label?: unknown;
    text?: unknown;
    whyItWorks?: unknown;
};

type RawDraftOptionsResponse = {
    options?: unknown;
};

const normalizeDraftLabel = (labelRaw: string): DraftOption["label"] => {
    const s = normalizeWhitespace(labelRaw).toLowerCase();

    if (s.includes("soft"))
        return "Soft Repair";

    if (s.includes("boundary"))
        return "Boundary + Respect";

    if (s.includes("direct") || s.includes("clear"))
        return "Direct & Clear";

    // fallback
    return "Soft Repair";
};


export function adaptDraftOptions(raw: unknown): DraftOptionsResult {
    const r = raw as RawDraftOptionsResponse;

    const arr = Array.isArray(r?.options) ? (r.options as RawDraftOption[]) : [];

    const mapped: DraftOption[] = arr.map((o): DraftOption | null => {
        const label = normalizeDraftLabel(asString(o.label, "Soft Repair"));
        const text = normalizeWhitespace(asString(o.text, ""));
        const whyItWorks = normalizeWhitespace(asString(o.whyItWorks, ""));

        if (!text)
            return null;

        return { label, text, whyItWorks};
    }).filter((x): x is DraftOption => x !== null);

    const fallback: DraftOption[] = [
        {
            label: "Soft Repair",
            text: "Hey, I've been thinking about what happened. Can we talk so I can understand your side?",
            whyItWorks: "Invites a calm repair without blame.",
        },
        {
            label: "Boundary + Respect",
            text: "I want to clear this up, but I can't do this when it gets heated. Can we revisit it when we're calmer?",
            whyItWorks: "Sets a boundary while keeping the door open.",
        },
        {
            label: "Direct & Clear",
            text: "When X happened, I felt Y. I'd like Z going forward. Are you open to that?",
            whyItWorks: "Clear and specific, focuses on a next step.",
        },
    ];

    const out = mapped.slice(0, 3);
    while (out.length < 3)
        out.push(fallback[out.length]);

    const order: DraftOption["label"][] = ["Soft Repair", "Boundary + Respect", "Direct & Clear"];
    out.sort((a, b) => order.indexOf(a.label) - order.indexOf(b.label));

    return { options : out};
}

// Roleplay Reply Adapter
type RawRoleplay = {
    reply?: unknown;
    stability?: unknown;
};

export function adaptRoleplayReply(raw: unknown): RoleplayResult {
    const r = raw as RawRoleplay;

    const reply = normalizeWhitespace(asString(r.reply, ""));
    const stability = clamp(Math.round(asNumber(r.stability, 55)), 0, 100);

    return {
        reply: reply || "I hear you. I need a little time to think about this.",
        stability,
    };
}

// Scenario Adapter
type RawScenario = {
    scenario?: {
        realm?: unknown;
        difficulty?: unknown;
        emotion?: unknown;
        description?: unknown;
    };
};

export function adaptScenario(
    raw: unknown,
    fallbackInput : { realm: ScenarioRealm; difficulty: 1 | 2 | 3 | 4 | 5}
): ScenarioResult {
    const r = raw as RawScenario;

    const realmRaw = r?.scenario?.realm;
    const realm: ScenarioRealm = isScenarioRealm(realmRaw) ? realmRaw : fallbackInput.realm;

    const diffRaw = asNumber(r?.scenario?.difficulty, fallbackInput.difficulty);
    const difficulty = clamp(Math.round(diffRaw), 1, 5) as 1 | 2 | 3 | 4 | 5;

    const emotion = normalizeWhitespace(asString(r?.scenario?.emotion, "frustrated"));
    const description = normalizeWhitespace(asString(r?.scenario?.description,""));

    if (!description) {
        return {
            scenario: {
                realm, 
                difficulty,
                emotion: "frustrated",
                description: "You texted a friend about plans, and they left you on read all day. Later you see them posting online. You want to address it without starting a fight.",
            },
        };
    }

    return {
        scenario: { realm, difficulty, emotion, description},
    };
}