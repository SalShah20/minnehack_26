/**
 * Initializes RunAnywhere SDK.
 * Functions:
 * - initRunAnywhere()
 * - generateDraftOptions()
 * - roleplayReply()
 */
import { RunAnywhere, SDKEnvironment, ModelCategory, type GenerationOptions } from '@runanywhere/core';
import { LlamaCPP } from '@runanywhere/llamacpp';
import { ONNX, ModelArtifactType } from '@runanywhere/onnx';
import {buildDraftOptionsPrompt, buildRoleplayPrompt, buildScenarioGenPrompt, type Goal, type Relationship, type OtherPersonVibe, type ScenarioRealm, type Scenario} from './prompts';

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
            initPromise = null;
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

async function generateJSON<T>(
    prompt: string,
    options?: Partial<GenerationOptions>
): Promise<T> {
    await ensureLLMLoaded();

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
    goal: Goal;
    relationship?: Relationship;
}): Promise<{options: DraftOption[]}> {
    const prompt = buildDraftOptionsPrompt(input);

    try {
        return await generateJSON<{options: DraftOption[]}>(prompt, {
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
    otherPersonVibe?: OtherPersonVibe;
    speak?: boolean;
}): Promise<{reply: string; stability: number}> {
    const prompt = buildRoleplayPrompt({
        scenario: input.scenario,
        userMessage: input.userMessage,
        otherPersonVibe: input.otherPersonVibe,
    });

    try {
        const out = await generateJSON<{reply: string; stability: number}>(prompt, {
            temperature: 0.6,
            maxTokens: 300,
        });

        out.stability = Math.max(0, Math.min(100, Math.round(out.stability)));
        if (input.speak) {
            await speakText(out.reply);
        }
        return out;
    } catch (e) {
        const fallback =  {reply: "I hear you. I need a little time to think about this.", stability: 55};
        if (input.speak) {
            await speakText(fallback.reply);
        }
        return fallback;
    }
}

export async function generateScenario(input: {
    realm: ScenarioRealm;
    difficulty: 1 | 2 | 3 | 4 | 5;
}): Promise<Scenario> {
    const prompt = buildScenarioGenPrompt({realm: input.realm,
        difficulty: input.difficulty,
    });
    
    try {
        const out = await generateJSON<Scenario>(prompt, {
            temperature: 0.8,
            maxTokens: 250,
        });

        const realm = out?.scenario?.realm;
        const diff = out?.scenario?.difficulty;
        const desc = out?.scenario?.description;

        if (!realm || !diff || !desc) {
            throw new Error("Scenario JSON missing required fields");
        }

        out.scenario.difficulty = Math.max(1, Math.min(5, out.scenario.difficulty)) as 1|2|3|4|5;
        
        out.scenario.emotion = (out.scenario.emotion ?? "").trim();
        out.scenario.description = out.scenario.description.trim();

        return out;
    } catch (e) {
        return {
            scenario: {
                realm: input.realm,
                difficulty: input.difficulty,
                emotion: "frustrated",
                description: "You texted a friend about plans, and they left you on read all day. Later, you see them posting online like nothing happened. You want to respond without starting a fight, but you also don't want to ignore it.",
            },
        };
    } 
}
