#!/usr/bin/env node
/**
 * envcheck — catch missing .env variables before your deploy breaks.
 *
 * Usage:
 *   envcheck                       compares .env with .env.example
 *   envcheck <envFile> <example>   compares two custom files
 *
 * Exit codes (useful in CI pipelines such as GitHub Actions):
 *   0  everything required is defined
 *   1  at least one variable is missing
 *   2  a file could not be found
 */
import { existsSync } from "node:fs";
import { compareEnv } from "./compare.js";
import { parseEnvFile } from "./parse.js";

// 1. Read the file paths from the command line, or use the defaults
const envFile = process.argv[2] ?? ".env";
const exampleFile = process.argv[3] ?? ".env.example";

// 2. Stop early with a clear message if a file does not exist
for (const file of [envFile, exampleFile]) {
  if (!existsSync(file)) {
    console.error(`✖ File not found: ${file}`);
    process.exit(2);
  }
}

// 3. Parse both files
const actual = parseEnvFile(envFile);
const required = parseEnvFile(exampleFile).keys();

// 4. Compare: only variable NAMES are used, never their values
const { missing, empty, ok } = compareEnv(required, actual);

// 5. Print a short, readable report
if (missing.length > 0) console.log(`✖ Missing: ${missing.join(", ")}`);
if (empty.length > 0) console.log(`⚠ Empty:   ${empty.join(", ")}`);
console.log(`✔ ${ok.length} variable${ok.length === 1 ? "" : "s"} OK`);

// 6. Fail (exit code 1) when something is missing, so a CI build can stop here
process.exit(missing.length > 0 ? 1 : 0);