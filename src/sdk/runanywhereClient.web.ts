// src/sdk/runanywhereClient.web.ts
import type {
  DraftOption,
  DraftOptionsResult,
  RoleplayResult,
  ScenarioResult,
  ScenarioRealm,
} from "../types/api";
import type { Goal, Relationship, OtherPersonVibe } from "./prompts";
import { buildDraftOptionsPrompt, buildRoleplayPrompt, buildScenarioGenPrompt } from "./prompts";

const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY;

// Very small helper: call OpenAI Responses API and return the text output.
async function callLLM(prompt: string): Promise<string> {
  if (!OPENAI_API_KEY) {
    throw new Error("Missing EXPO_PUBLIC_OPENAI_API_KEY");
  }

  const res = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      input: prompt,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`LLM error: ${res.status} ${text}`);
  }

  const json = await res.json();

  // Responses API returns an array of output items; easiest is to grab "output_text" convenience:
  // Some SDKs return json.output_text; if not present, fall back to stitching text parts.
  const outText =
    (json.output_text as string | undefined) ??
    (json.output?.flatMap((o: any) => o.content ?? []).map((c: any) => c.text).join("") as string | undefined) ??
    "";

  return outText.trim();
}

function extractJSONObject(text: string): any {
  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");
  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    throw new Error("LLM did not return JSON");
  }
  return JSON.parse(text.slice(firstBrace, lastBrace + 1));
}

export async function initRunAnywhere(): Promise<void> {
  // no-op for web
  return;
}
export function getRunAnywhereStatus() {
  return { status: "ready" as const, initError: null as any };
}

export async function generateDraftOptions(input: {
  scenario: string;
  goal: Goal;
  relationship?: Relationship;
}): Promise<DraftOptionsResult> {
  const prompt = buildDraftOptionsPrompt(input);
  const text = await callLLM(prompt);
  return extractJSONObject(text) as DraftOptionsResult;
}

export async function roleplayReply(input: {
  scenario: string;
  userMessage: string;
  otherPersonVibe?: OtherPersonVibe;
  speak?: boolean;
}): Promise<RoleplayResult> {
  const prompt = buildRoleplayPrompt({
    scenario: input.scenario,
    userMessage: input.userMessage,
    otherPersonVibe: input.otherPersonVibe,
  });
  const text = await callLLM(prompt);
  return extractJSONObject(text) as RoleplayResult;
}

export async function generateScenario(input: {
  realm: ScenarioRealm;
  difficulty: 1 | 2 | 3 | 4 | 5;
}): Promise<ScenarioResult> {
  const prompt = buildScenarioGenPrompt(input);
  const text = await callLLM(prompt);
  return extractJSONObject(text) as ScenarioResult;
}
