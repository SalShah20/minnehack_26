/**
 * BuddyItems Component
 *
 * Renders cosmetic accessories attached to the Tamagotchi buddy.
 *
 * Responsibilities:
 * - Display unlocked cosmetic items (e.g., bandaid, heart patch, gold crack, tea cup)
 * - Position items correctly relative to BuddySprite
 * - Animate items when unlocked (optional sparkle / bounce)
 *
 * Props:
 * - unlockedItems: string[]      // list of unlocked item IDs
 * - equippedItems?: string[]     // items currently visible on buddy
 * - mood?: BuddyMood             // optional for mood-specific cosmetics
 *
 * This component is purely visual.
 * It does NOT handle XP logic, unlock logic, or state updates.
 *
 * Unlock logic lives in:
 * - src/engine/game/achievements.ts
 * - src/engine/game/xp.ts
 *
 * Used by:
 * - BuddySprite.tsx
 * - Buddy dashboard screen
 */
