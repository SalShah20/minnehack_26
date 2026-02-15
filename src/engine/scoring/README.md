# Scoring Engine

Core game logic. Analyzes user messages and calculates Heat/Repair scores.

---

## How to Use

### Import
```ts
import {scoreMessage} from "@/engine/scoring/scoreMessage";
import {calculateImprovement, getImprovementMessage} from "@/engine/scoring/improvements";
import {findHighlights, getTriggeredPhrases} from "@/engine/scoring/highlights";
```

---

## 1. Score a Message

**Purpose:** Analyze a user's response and return Heat/Repair scores.

**Usage**
```ts
const result = scoreMessage("I'm sorry I didn't respond. I understand you were hurt.");
```

**Returns:**
```ts
type ScoreResult = {
    heat: number;
    repair: number;
    heatTriggers: string[];
    repairTriggers: string[];
    combo: ComboType | null;
    xp: number;
};
```

---

## 2. Calculate Improvement and Improvement Message

**Purpose:** Compare two attempts and reward improvement. Improvement message shows encouragement.

**When to Use:** When the user wants to try again in Practice Mode.

**Usage:**
```ts
const firstScore = scoreMessage("You never listen to me!");
const secondScore = scoreMessage("I feel unheard. Can we talk about this?");
const improvement = calculateImprovement(firstScore, secondScore);

const message = getImprovementMessage(improvement);
```

**Returns:**
```ts
type ImprovementResult = {
    heatImproved: boolean;
    repairImproved: boolean;
    heatDelta: number;
    repairDelta: number;
    bonusXP: number;
    improvementLevel: "none" | "slight" | "good" | "great";
};
```

---

## 3. Find Highlights

**Purpose:** Find specific phrases that triggered the scores for feedback.

**Usage:**
```ts
const message = "You never listen! I'm sorry but you always ignore me.";
const highlights = findHighlights(message);