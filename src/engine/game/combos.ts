/**
 * Detects repair combos.
 *
 * Combo = validation + ownership + curiosity/boundary.
 *
 * Applies XP multipliers.
 */

export function combo(flags: string[]) {
    let multiplier = 1;
    let message = null;

    const hasValidation = flags.includes("validation");
    const hasOwnership = flags.includes("ownership");
    const hasBoundary = flags.includes("boundary");

    if (hasValidation && hasOwnership && hasBoundary) {
        multiplier = 2;
        message = "Repair Master!"
    }
    else if ((hasValidation && hasOwnership) || (hasValidation && hasBoundary) || (hasOwnership && hasBoundary)) {
        multiplier = 1.5;
        message = "Strong Repair!"
    }

    return {message, multiplier};
}