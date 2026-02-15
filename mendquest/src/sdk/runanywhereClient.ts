/**
 * Initializes RunAnywhere SDK.
 * Functions:
 * - initRunAnywhere()
 * - generateDraftOptions()
 * - roleplayReply()
 */
import { RunAnywhere, SDKEnvironment, ModelCategory, GenerationOptions } from '@runanywhere/core';
import { LlamaCPP } from '@runanywhere/llamacpp';
import { ONNX, ModelArtifactType } from '@runanywhere/onnx';

type InitStatus = "not_started" | "initializing" | "ready" | "error";

let status: InitStatus = "not_started";
let initPromise: Promise<void> | null = null;
let initError: unknown = null;

let loadedModelId: string | null = null;

// LLM and voice models from the example
const DEFAULT_LLM_ID = "smollm2-360m-q8_0";
const DEFAULT_STT_ID = "sherpa-onnx-whisper-tiny.en";
const DEFAULT_TTS_ID = "vits-piper-en_US-lessac-medium";

async function registerModulesandModels() {
    // Register backends
    LlamaCPP.register();
    ONNX.register();

    // LLM model
    await LlamaCPP.addModel({
        id: DEFAULT_LLM_ID,
        name: "SmolLM2 360M Q8_0",
        url: "https://huggingface.co/prithivMLmods/SmolLM2-360M-GGUF/resolve/main/SmolLM2-360M.Q8_0.gguf",
        memoryRequirement: 500_000_000,
    });

    // Speech-to-text model
    await ONNX.addModel({
        id: DEFAULT_STT_ID,
        name: "Sherpa Whisper Tiny (ONNX)",
        url: "https://github.com/RunanywhereAI/sherpa-onnx/releases/download/runanywhere-models-v1/sherpa-onnx-whisper-tiny.en.tar.gz",
        modality: ModelCategory.SpeechRecognition,
        artifactType: ModelArtifactType.TarGzArchive,
        memoryRequirement: 75_000_000,
    });

    // Text-to-speech model
    await ONNX.addModel({
        id: DEFAULT_TTS_ID,
        name: "Piper TTS (US English - Medium)",
        url: "https://github.com/RunanywhereAI/sherpa-onnx/releases/download/runanywhere-models-v1/vits-piper-en_US-lessac-medium.tar.gz",
        modality: ModelCategory.SpeechSynthesis,
        artifactType: ModelArtifactType.TarGzArchive,
        memoryRequirement: 65_000_000,
    });

    console.log("[RunAnywhere] Modules + models registered");
}

/**
 * Initialize the SDK.
 */
export function initRunAnywhere(): Promise<void> {
    if (status === "ready") 
        return Promise.resolve();
    if (initPromise)
        return initPromise;

    status = "initializing";
    initPromise = (async () => {
        try {
            await RunAnywhere.initialize({
                apiKey: "",
                baseURL: "https://api.runanywhere.ai",
                environment: SDKEnvironment.Development,
            });

            // Ensure backend is ready
            const isInit = await RunAnywhere.isInitialized();
            if (!isInit)
                throw new Error("RunAnywhere reports not initialized");

            // Register all models
            await registerModulesandModels();

            status = "ready";
            console.log("[RunAnywhere] Ready");
        } catch (e) {
            status = "error";
            initError = e;
            console.error("[RunAnywhere] init failed:", e);
            throw e;
        }
    })();

    return initPromise;
}

export function getRunAnywhereStatus() {
    return {
        status, initError
    };
}

/**
 * Ensure some LLM is loaded before trying to generate.
 */
export async function ensureLLMLoaded(): Promise<void> {
    await initRunAnywhere();

    const alreadyLoaded = await RunAnywhere.isModelLoaded();
    if (alreadyLoaded)
        return;

    const all = await RunAnywhere.getAvailableModels();
    const llms = all.filter((m) => m.category === ModelCategory.Language);

    const chosen = llms.find((m) => m.id === DEFAULT_LLM_ID) ??
        llms.find((m) => m.isDownloaded) ??
        llms[0];

    if (!chosen)
        throw new Error("No LLM models available. Did you forget to register the models?");

    if (!chosen.localPath)
        throw new Error(`Model ${chosen.id} is not downloaded yet, localPath is missing.`);

    const success = await RunAnywhere.loadModel(chosen.localPath);
    if (!success) {
        const err = await RunAnywhere.getLastError();
        throw new Error(`Failed to load model ${chosen.id}: ${err || "Unknown error"}`);
    }

    loadedModelId = chosen.id;
    console.log("[RunAnywhere] Loaded model:", chosen.id);
}

function buildJSONPrompt(schematic: string, task: string) {
    return `You must return ONLY a valid JSON. No markdown. No extra keys.
    Schema:
    ${schematic}
    
    Task:
    ${task}`.trim();
}

async function generateJSON<T>(
    task: string,
    schematic: string,
    options?: Partial<GenerationOptions>
): Promise<T> {
    await ensureLLMLoaded();

    const prompt = buildJSONPrompt(schematic, task);

    const result = await RunAnywhere.generateWithTools(prompt, {
        autoExecute: false,
        maxToolCalls: 0,
        maxTokens: options?.maxTokens ?? 700,
        temperature: options?.temperature ?? 0.4,
        systemPrompt: options?.systemPrompt,
    });

    const text = (result.text || "").trim();

    const firstBrace = text.indexOf("{");
    const lastBrace = text.lastIndexOf("}");
    if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
        throw new Error("LLM did not return valid JSON");
    }

    const jsonStr = text.slice(firstBrace, lastBrace + 1);
    return JSON.parse(jsonStr) as T;
}

export type DraftOption = {
    label: "Soft Repair" | "Boundary + Respect" | "Direct & Clear";
    text: string;
    whyItWorks: string;
};

export async function generateDraftOptions(input: {
    scenario: string;
    goal: "Reconnect" | "Apologize" | "Set Boundary" | "Clarify";
    relationship?: "Friend" | "Partner" | "Family" | "Work/School" | "Roommate";
}): Promise<{options: DraftOption[]}> {
    const schematic = `
    {
        "options": [
            { "label": "Soft Repair", "text": "string", "whyItWorks": "string"},
            { "label": "Boundary + Respect", "text": "string", "whyItWorks": "string"},
            { "label": "Direct & Clear", "text": "string", "whyItWorks": "string" }
            ]
    }
    `.trim();

    const task = `
    Write 3 short message drafts (2-5 sentences) for this situation.
    Keep tone calm, human, and realistic (not therapy jargon).
    No manipulation or guilt-tripping.
    Goal: ${input.goal}
    Relationship: ${input.relationship ?? "Unspecified"}
    Scenario: ${input.scenario}`.trim();

    try {
        return await generateJSON<{options: DraftOption[]}>(task, schematic, {
            temperature: 0.5,
            maxTokens: 700,
        });
    } catch (e) {
        return {
            options: [
                {
                    label: "Soft Repair",
                    text: "Hey — I’ve been feeling a bit off about what happened. Can we talk so I can understand your side?",
                    whyItWorks: "Invites conversation without blaming.",
                },
                {
                    label: "Boundary + Respect",
                    text: "I want to clear this up, but I can’t do a back-and-forth when things get heated. Can we talk when we’re both calmer?",
                    whyItWorks: "Sets a boundary while keeping connection.",
                },
                {
                    label: "Direct & Clear",
                    text: "When X happened, I felt Y. I’d like Z moving forward. Are you open to that?",
                    whyItWorks: "Clear, specific, and solution-focused.",
                },
            ],
        };
    }
}

export async function speakText(text: string) {
    await initRunAnywhere();
    const clean = text.trim();

    if (!clean)
        return;

    const speaking = await RunAnywhere.isSpeaking();
    if (speaking) {
        await RunAnywhere.stopSpeaking();
    }

    await RunAnywhere.speak(clean, {rate: 1.0, pitch: 1.0, volume: 1.0});
}

export async function roleplayReply(input: {
    scenario: string;
    userMessage: string;
    otherPersonVibe?: "defensive" | "hurt" | "busy" | "confused";
    speak?: boolean;
}): Promise<{reply: string; stability: number}> {
    const schematic = `
    { "reply": "string", "stability": 0}`.trim();

    const task = `
    Roleplay as the other person in this scenario.
    Reply in 1-3 short messages.
    Be realistic and not overly nice.
    Return stability score 0-100 where:
    0 = conversation likely ends badly
    100 = conversation likely mends well
    
    Other persn vibe: ${input.otherPersonVibe ?? "unspecified"}
    
    Scenario: ${input.scenario}
    
    User message: ${input.userMessage}`.trim();

    try {
        const out = await generateJSON<{reply: string; stability: number}>(task, schematic, {
            temperature: 0.6,
            maxTokens: 300,
        });

        out.stability = Math.max(0, Math.min(100, Math.round(out.stability)));
        if (input.speak) {
            await speakText(out.reply);
        }
        return out;
    } catch (e) {
        return {
            reply: "I hear you. I need a little time to think about this.", stability: 55
        };
    }
}
