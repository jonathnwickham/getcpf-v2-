/**
 * Masks a passport number showing only the last 4 characters.
 * e.g. "AB1234567" → "***4567"
 */
export const maskPassport = (passportNumber: string | null | undefined): string => {
  if (!passportNumber) return "—";
  const trimmed = passportNumber.trim();
  if (trimmed.length <= 4) return trimmed;
  return "***" + trimmed.slice(-4);
};
