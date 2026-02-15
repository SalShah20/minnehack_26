# RunAnywhere SDK Integration

Use exported function from `runanywhereClient.ts` in the UI components.

## Initialization

The SDK auto-initializes when any exported function is called.

If you need to manually initialize:

```ts
import {initRunAnywhere} from "@/sdk";
await initRunAnywhere();
```

## Imports

```ts
import { generateDraftOptions, roleplayReply, generateScenario} from "@/sdk";
```

## Generate Draft Options

Generates 3 message drafts for conflict scenario.

How to use it:

Goal options: Reconnect, Apologize, Set Boundary, Clarify

Relationship Options: Friend, Partner, Family, Work/School, Roommate

```ts
const {options} = await generateDraftOptions({
  scenario: "Whatever scenario",
  goal: "Goal of convo",
  relationship: "Relationship to that person",
});
```

What it returns:

```ts
{
  options: [
    {
      label: "Response type",
      text: "What to say",
      whyItWorks: "Why the response works"
    },
    {
      label: "Response type",
      text: "What to say",
      whyItWorks: "Why the response works"
    },
    {
      label: "Response type",
      text: "What to say",
      whyItWorks: "Why the response works"
    }
  ]
}
```

Label options: Soft Repair, Boundary + Respect, Direct & Clear

## Roleplay Reply

Simulates how the other person might respond to the user's message. It can speak out loud if you want it to.

How to use it:

```ts
const { reply, stability } = await roleplayReply({
  scenario: "the scenario",
  userMessage: "what the user said",
  otherPersonVibe: "the vibe",
  speak: "boolean if you want it to speak out loud or not"
});
```

Other person vibe options: defensive, hurt, busy, confused

What it returns:

0 = conversation will probably end relationship/escalate

100 = strong chance the relationship will be repaired

```ts
{
  reply: "roleplay response",
  stability: 0 - 100
}
```

## Generate Scenario

Generate a scenario for the user to practice

How to use it:

```ts
const { scenario } = await generateScenario({
  realm: "Realm of scenario",
  difficulty: 1 - 5,
});
```

Realm options: Friend, Partner, Family, Work/School, Roommate

What it returns:

```ts
{
  scenario: {
    realm: "Friend",
    difficulty: 3,
    emotion: "hurt",
    description: "Your friend hasn’t responded to your messages but is active online. You feel ignored and unsure whether to confront them."
  }
}
```