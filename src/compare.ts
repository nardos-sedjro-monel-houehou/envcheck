/** Result of comparing the variables you need with the variables you have. */
export type CompareResult = {
  /** Required by the example file but not defined at all */
  missing: string[];
  /** Defined, but with an empty value */
  empty: string[];
  /** Defined with a value */
  ok: string[];
};

/**
 * Compares the required variable names (from .env.example)
 * with the variables that are actually defined (.env, Vercel, Azure...).
 *
 * Only names are compared and returned: values are never exposed,
 * so secrets cannot leak into the terminal or CI logs.
 */
export function compareEnv(required: Iterable<string>, actual: Map<string, string>): CompareResult {
  const result: CompareResult = { missing: [], empty: [], ok: [] };

  for (const name of required) {
    if (!actual.has(name)) {
      result.missing.push(name);
    } else if (actual.get(name) === "") {
      result.empty.push(name);
    } else {
      result.ok.push(name);
    }
  }

  return result;
}