/**
 * Detects repair combos.
 *
 * Combo = validation + ownership + curiosity/boundary.
 *
 * Applies XP multipliers.
 */
import type { ComboType } from "../scoring/scoreMessage";

export type ComboMeta = {
    label: string;
    description: string;
    bonusXP: number;
};

export function getComboMeta(combo: ComboType): ComboMeta {
    switch (combo) {
        case "validation_ownership":
            return {
                label: "Empathy Combo",
                description: "You validated and took ownership.",
                bonusXP: 15,
            };
        case "validation_boundary":
            return {
                label: "Respect Combo",
                description: "You validated while setting a boundary.",
                bonusXP: 15,
            };
        case "ownership_curiosity":
            return {
                label: "Growth Combo",
                description: "You owned your part and invited dialogue.",
                bonusXP: 15,
            }
        case "full_repair":
            return {
                label: "Full Repair Mastery",
                description: "Validation + ownership + forward movement.",
                bonusXP: 25,
            };
        default:
            return {
                label: "No Combo",
                description: "",
                bonusXP: 0,
            };
    }
}