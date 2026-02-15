/**
 * Prompt templates for:
 * - Roleplay
 * - Draft generation
 * - Scenario generation
 *
 * Keep structured for consistent outputs.
 */

export type Relationship = "Friend" | "Family" | "Partner" | "Work/School" | "Roommate" | "Unspecified";

export type Goal = "Reconnect" | "Apologize" | "Set Boundary" | "Clarify";

export type OtherPersonVibe = "defensive" | "hurt" | "busy" | "confused";

import type { Scenario, ScenarioRealm } from "../types/api";

/**
 * Global rules to ensure consistent prompts and response formats.
 */
export const JSON_ONLY_RULES = `
You must return ONLY valid JSON.
- No markdown
- No code fences
- No explanations
- No extra keys
- No trailing commas
If you cannot comply, return {"error": "invalid_output"}.
`.trim();

export const TONE_RULES = `
Write like a real person texting.
- 2-5 sentences max per message
- Calm, respectful, realistic
- Avoid therapy jargon
- No manipulation, no guilt-tripping, no threats, no insults
- Avoid absolutes like "always" or "never"
`.trim();

export function buildJSONPrompt(task: string, schematic: string): string {
    return `
    ${JSON_ONLY_RULES}
    
    Schematic:
    ${schematic}
    
    ${TONE_RULES}
    
    Task:
    ${task}`.trim();
}

export const DRAFT_OPTIONS_SCHEMATIC = `
{
    "options": [
        { "label": "Soft Repair", "text": "string", "whyItWorks": "string"},
        { "label": "Boundary + Respect", "text": "string", "whyItWorks": "string"},
        { "label": "Direct & Clear", "text": "string", "whyItWorks": "string" }
    ]
}`.trim();

export function draftOptionsTask(input: {
    scenario: string;
    goal: Goal;
    relationship?: Relationship;
}): string {
    return `
    Generate exactly 3 message drafts for the user to send.
    
    Context:
    - Goal: ${input.goal}
    - Relationship: ${input.relationship ?? "Unspecified"}
    
    Scenario:
    ${input.scenario}
    
    Constraints:
    - Each draft should be 2-5 sentences max.
    - Keep the three drafts meaningfully different in tone/style:
    1. Soft Repair: warm, reconnecting, invites dialogue
    2. Boundary + Respect: calm boundary, no blame
    3. Direct & Clear: concise, specific request, no harshness`.trim();
}

export function buildDraftOptionsPrompt(input: {
    scenario: string;
    goal: Goal;
    relationship?: Relationship;
}): string {
    return buildJSONPrompt(draftOptionsTask(input), DRAFT_OPTIONS_SCHEMATIC);
}

export const ROLEPLAY_REPLY_SCHEMATIC = `
{
    "reply": "string",
    "stability": 0
}
`.trim();

export function roleplayTask(input: {
    scenario: string;
    userMessage: string;
    otherPersonVibe?: OtherPersonVibe;
}): string {
    return `
    Roleplay as the other person in this scenario.

    Scenario:
    ${input.scenario}

    User message:
    ${input.userMessage}

    Other person vibe: ${input.otherPersonVibe ?? "unspecified"}

    Instructions:
    Reply in 1-3 short messages.
    Be realistic and not overly nice.
    Return stability score 0-100 where:
    0 = conversation likely ends badly
    100 = conversation likely mends well
    `.trim();
}

export function buildRoleplayPrompt(input: {
    scenario: string;
    userMessage: string;
    otherPersonVibe?: OtherPersonVibe;
}): string {
    return buildJSONPrompt(roleplayTask(input), ROLEPLAY_REPLY_SCHEMATIC);
}

export const SCENARIO_GENERATION_SCHEMATIC = `
{
    "scenario": {
        "realm": "Friend",
        "difficulty": 1,
        "emotion": "string",
        "description": "string"
    }
}`.trim();

export function scenarioGenTask(input: {
    realm: ScenarioRealm;
    difficulty: 1 | 2 | 3 | 4 | 5;
}): string {
    return `
    Generate one practice scenario for the user to respond to.
    
    Realm: ${input.realm}
    Difficulty: ${input.difficulty}
    
    Constraints:
    - Realm must be one of: "Friend", "Family", "Partner", "Work/School", "Roommate"
    - Emotion: one or two words (e.g., "hurt", "jealous", "overwhelmed")
    - Description: 2-4 sentences, concrete and relatable
    - No extreme content, no self-harm, no illegal instructions
    - Make it "mendable" (it is possible to repair the relationship)
    `.trim();
}

export function buildScenarioGenPrompt(input: {
    realm: ScenarioRealm;
    difficulty: 1 | 2 | 3 | 4 | 5;
}): string {
    return buildJSONPrompt(scenarioGenTask(input), SCENARIO_GENERATION_SCHEMATIC);
}