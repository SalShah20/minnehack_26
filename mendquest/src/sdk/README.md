# RunAnywhere SDK Integration

Use exported function from `runanywhereClient.ts` in the UI components.

## Initialization

The SDK auto-initializes when any exported function is called.

If you need to manually initialize:

```ts
import {initRunAnywhere} from "@/sdk/runanywhereClient";

await initRunAnywhere();
```

## Generate Draft Options

Generates 3 message drafts for conflict scenario.

```ts
import {generateDraftOptions} from
"@/sdk/runanywhereClient";
```

How to use it:

Goal options: Reconnect, Apologize, Set Boundary, Clarify

Relationship options: Friend, Partner, Family, Work/School, Roommate

```ts
const result = await generateDraftOptions({
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

Simulates how the other person might respond to the user's message.

How to use it:

```ts
const result = await roleplayReply({
  scenario: "the scenario",
  userMessage: "what the user said",
});
```

What it returns:

0 = conversation will probably end relationship/escalate

100 = strong chance the relationship will be repaired

```ts
{
  reply: "roleplay response",
  stability: 0 - 100
}
```
