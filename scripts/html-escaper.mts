const { replace } = "";

// escape
const ca = /[&<>'"]/g;

type EscapeChar = "&" | "<" | ">" | "'" | '"';

const esca: Record<EscapeChar, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  "'": "&#39;",
  '"': "&quot;",
};

/**
 * @param m - The character to escape
 */
const pe = (m: EscapeChar): string => esca[m];

/**
 * Safely escape HTML entities such as `&`, `<`, `>`, `"`, and `'`.
 * @param es - the input to safely escape
 * @returns the escaped input, and it **throws** an error if
 *  the input type is unexpected, except for boolean and numbers,
 *  converted as string.
 */
export const escaper = (es: string): string => replace.call(es, ca, pe);
