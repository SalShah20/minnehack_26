// src/sdk/runanywhereClient.web.ts
import type {
  DraftOptionsResult,
  RoleplayResult,
  ScenarioResult,
  ScenarioRealm,
} from "../types/api";
import type { Goal, Relationship, OtherPersonVibe } from "./prompts";
import {
  buildDraftOptionsPrompt,
  buildRoleplayPrompt,
  buildScenarioGenPrompt,
} from "./prompts";

import { RunAnywhere, SDKEnvironment, TextGeneration } from "@runanywhere/web";

// Pick a SMALL gguf for demo and put it in: public/models/
// Then it can be loaded via /models/<file>.gguf
const MODEL_URL = "/models/qwen2.5-0.5b-instruct-q4_0.gguf";
const MODEL_ID = "qwen2.5-0.5b";

let initPromise: Promise<void> | null = null;

async function ensureInitialized() {
  if (initPromise) return initPromise;

  initPromise = (async () => {
    await RunAnywhere.initialize({
      environment: SDKEnvironment.Development,
      debug: true,
    });

    // Load model once
    await TextGeneration.loadModel(MODEL_URL, MODEL_ID);
    console.log("[RunAnywhere/web] Ready + model loaded:", MODEL_ID);
  })();

  return initPromise;
}

async function callLLM(prompt: string): Promise<string> {
  await ensureInitialized();

  const result = await TextGeneration.generate(prompt, {
    maxTokens: 700,
    temperature: 0.5,
  });

  // result.text is what we want
  return (result.text ?? "").trim();
}

function extractJSONObject(text: string): any {
  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");
  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    throw new Error("LLM did not return JSON");
  }
  return JSON.parse(text.slice(firstBrace, lastBrace + 1));
}

// API expected by your app
export async function initRunAnywhere(): Promise<void> {
  await ensureInitialized();
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