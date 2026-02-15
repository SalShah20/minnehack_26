/**
 * HighlightedText Component
 *
 * Displays user message with visual highlights:
 * - Red underline for "heat" phrases (blame, absolutes)
 * - Green underline for "repair" phrases (validation, ownership)
 *
 * Props:
 * - text: string
 * - heatPhrases: string[]
 * - repairPhrases: string[]
 *
 * Purely presentational.
 * Highlight detection logic lives in:
 * - src/engine/scoring/highlights.ts
 */