# RunAnywhere SDK Integration

Use exported functions from `runanywhereClient.ts` in UI components.

## Initialization

Optional manual initialization:
```ts
import { initRunAnywhere } from "@/sdk";
await initRunAnywhere();
```

Check SDK status:
```ts
import { getRunAnywhereStatus } from "@/sdk";
const { status, initError } = getRunAnywhereStatus();
// status: "not_started" | "initializing" | "ready" | "error"
```

---

## All Available Functions
```ts
import { 
    generateDraftOptions, 
    roleplayReply, 
    generateScenario,
    speakText,
    ensureLLMLoaded,
    initRunAnywhere,
    getRunAnywhereStatus 
} from "@/sdk";
```

---

## 1. Generate Draft Options

**Purpose:** Generates 3 message drafts for Real-Life Helper Mode.

**When to use:** When user enters a real scenario and needs AI-generated response options.

**Parameters:**
- `scenario` (string, required): The conflict situation description
- `goal` (required): One of `"Reconnect"` | `"Apologize"` | `"Set Boundary"` | `"Clarify"`
- `relationship` (optional): One of `"Friend"` | `"Partner"` | `"Family"` | `"Work/School"` | `"Roommate"` | `"Unspecified"`

**Usage:**
```ts
const { options } = await generateDraftOptions({
    scenario: "My roommate keeps leaving dishes in the sink for days",
    goal: "Set Boundary",
    relationship: "Roommate",
});
```

**Returns:**
```ts
{
    options: [
        {
            label: "Soft Repair",
            text: "Hey, I noticed the dishes have been piling up. I totally get life gets busy — can we figure out a system that works for both of us?",
            whyItWorks: "Opens dialogue without accusation"
        },
        {
            label: "Boundary + Respect",
            text: "I need to set a boundary around shared spaces. Can we agree to clean our dishes within 24 hours?",
            whyItWorks: "Clear boundary while staying respectful"
        },
        {
            label: "Direct & Clear",
            text: "The dishes situation isn't working for me. I'd like us to clean up after ourselves same-day. Can you commit to that?",
            whyItWorks: "Specific request with clear expectation"
        }
    ]
}
```

**Label types:** Always returns exactly these 3 labels:
- `"Soft Repair"`
- `"Boundary + Respect"`
- `"Direct & Clear"`

---

## 2. Roleplay Reply

**Purpose:** Simulates how the other person might respond to the user's message. Used for testing messages before sending.

**When to use:** 
- After user writes a response in Practice Game Mode
- After user edits a draft in Real-Life Helper Mode
- When user wants to test a message

**Parameters:**
- `scenario` (string, required): The original conflict description
- `userMessage` (string, required): What the user wants to say
- `otherPersonVibe` (optional): One of `"defensive"` | `"hurt"` | `"busy"` | `"confused"`
- `speak` (boolean, optional): Set to `true` to enable text-to-speech

**Usage:**
```ts
const { reply, stability } = await roleplayReply({
    scenario: "Friend hasn't responded but is posting on social media",
    userMessage: "Hey, I noticed you've been active online. Is everything okay between us?",
    otherPersonVibe: "defensive",
    speak: false,  // Set to true to hear the reply
});
```

**Returns:**
```ts
{
    reply: "I've just been busy, okay? I don't need to respond to every message immediately.",
    stability: 45
}
```

**Stability score interpretation:**
- `0-30`: Conversation likely to escalate or end badly
- `31-60`: Neutral/uncertain outcome
- `61-100`: Strong chance of successful repair

---

## 3. Generate Scenario

**Purpose:** Creates practice scenarios for Practice Game Mode.

**When to use:** When user selects a realm and difficulty level in Play tab.

**Parameters:**
- `realm` (required): One of `"Friend"` | `"Partner"` | `"Family"` | `"Work/School"` | `"Roommate"`
- `difficulty` (required): Number from 1 to 5

**Usage:**
```ts
const { scenario } = await generateScenario({
    realm: "Friend",
    difficulty: 3,
});
```

**Returns:**
```ts
{
    scenario: {
        realm: "Friend",
        difficulty: 3,
        emotion: "hurt",
        description: "Your friend hasn't responded to your messages but is active online. You feel ignored and unsure whether to confront them."
    }
}
```

**Difficulty scale:**
- `1`: Simple misunderstanding, easy to repair
- `2`: Minor conflict, requires some care
- `3`: Moderate tension, needs thoughtful approach
- `4`: Significant rupture, challenging to navigate
- `5`: High-stakes situation, requires advanced skills

---

## 4. Speak Text (Text-to-Speech)

**Purpose:** Reads text aloud using on-device TTS.

**When to use:**
- Reading roleplay replies
- Accessibility features
- User preference for audio feedback

**Parameters:**
- `text` (string, required): Text to speak

**Usage:**
```ts
await speakText("I hear you. Let's talk about this calmly.");
```

---

## 5. Ensure LLM Loaded

**Purpose:** Manually ensure the AI model is loaded before making calls.

**When to use:** 
- On app startup to preload the model
- Before showing loading screens
- Rarely needed since other functions auto-load

**Usage:**
```ts
await ensureLLMLoaded();
// Model is now ready
```

**What it does:**
- Checks if a model is already loaded
- If not, loads the default LLM (SmolLM2 360M Q8_0)

---

## Type Definitions Summary
```ts
type Goal = "Reconnect" | "Apologize" | "Set Boundary" | "Clarify";

type Relationship = "Friend" | "Family" | "Partner" | "Work/School" | "Roommate" | "Unspecified";

type ScenarioRealm = "Friend" | "Family" | "Partner" | "Work/School" | "Roommate";

type OtherPersonVibe = "defensive" | "hurt" | "busy" | "confused";

type DraftOption = {
    label: "Soft Repair" | "Boundary + Respect" | "Direct & Clear";
    text: string;
    whyItWorks: string;
};
```

---

## Common UI Patterns

### Pattern 1: Real-Life Helper Flow
```ts
// Step 1: User enters scenario
const userScenario = "...";
const selectedGoal = "Reconnect";

// Step 2: Generate drafts
const { options } = await generateDraftOptions({
    scenario: userScenario,
    goal: selectedGoal,
    relationship: "Friend",
});

// Step 3: User selects and edits a draft
const editedMessage = "...";

// Step 4: Test with roleplay
const { reply, stability } = await roleplayReply({
    scenario: userScenario,
    userMessage: editedMessage,
    speak: true,  // Optional: hear the response
});

// Step 5: Show stability score and reply to user
```

### Pattern 2: Practice Game Flow
```ts
// Step 1: Generate scenario
const { scenario } = await generateScenario({
    realm: "Friend",
    difficulty: 3,
});

// Step 2: User writes response
const userResponse = "...";

// Step 3: Get roleplay feedback
const { reply, stability } = await roleplayReply({
    scenario: scenario.description,
    userMessage: userResponse,
    otherPersonVibe: "hurt",
});

// Step 4: Calculate scores (Heat/Repair) in your game engine
// Step 5: Show results and allow "Try Again"
```
