/** Formats total inches as feet and inches, e.g. 74 -> 6'2". */
export function formatHeight(totalInches: number): string {
  const feet = Math.floor(totalInches / 12)
  const inches = totalInches % 12
  return `${feet}'${inches}"`
}
