import { readFileSync } from "node:fs";

/**
 * Reads a .env-style file and returns its variables as a Map (name -> value).
 *
 * Supported syntax:
 *   KEY=value
 *   KEY="quoted value"
 *   export KEY=value
 *   # comments and empty lines are ignored
 */
export function parseEnvFile(path: string): Map<string, string> {
  const vars = new Map<string, string>();

  // Split on both Windows (\r\n) and Unix (\n) line endings
  const lines = readFileSync(path, "utf8").split(/\r?\n/);

  for (const rawLine of lines) {
    const line = rawLine.trim();

    // Skip empty lines and comments
    if (line === "" || line.startsWith("#")) continue;

    // A valid line needs an "=" sign: KEY=value
    const separator = line.indexOf("=");
    if (separator === -1) continue;

    // Everything before "=" is the name (without an optional "export ")
    const key = line.slice(0, separator).replace(/^export\s+/, "").trim();

    // Everything after "=" is the value, without surrounding quotes
    const value = line
      .slice(separator + 1)
      .trim()
      .replace(/^(['"])(.*)\1$/, "$2");

    if (key !== "") vars.set(key, value);
  }

  return vars;
}