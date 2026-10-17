#!/usr/bin/env node
// Regenerate nomba-api-reference/sdk-playground-map.json from the installed @nomba/node-sdk's
// .d.ts files. Each SDK method's JSDoc starts with `VERB /path`; the playground deep-links with
// `#resource.method` (see sdk-playground/public/playground.js's `key()`). This script maps
// "VERB /path" (openapi.json's own path syntax, e.g. "{subAccountId}") to "resource.method" so the
// docs site can build a playground URL for whichever endpoint it's showing, read straight off the
// DOM at runtime (see try-it-dropdown.js) with no per-page config.
//
// Re-run whenever @nomba/node-sdk bumps in sdk-playground/package.json:
//   node scripts/build-sdk-playground-map.mjs <path-to-sdk-playground-repo>

import { readFileSync, writeFileSync, existsSync, globSync } from 'node:fs';
import { join } from 'node:path';

const playgroundRepo = process.argv[2] ?? '../Tryouts/Node/sdk-playground';
const sdkDir = join(playgroundRepo, 'node_modules/@nomba/node-sdk/dist');
const nombaDts = join(sdkDir, 'nomba.d.ts');

if (!existsSync(nombaDts)) {
  console.error(`Can't find ${nombaDts}. Pass the sdk-playground repo path as an argument.`);
  process.exit(1);
}

// resource property -> interface name, e.g. "checkout" -> "ICheckoutService"
const propToInterface = new Map();
for (const m of readFileSync(nombaDts, 'utf8').matchAll(/readonly (\w+): (I\w+);/g)) {
  propToInterface.set(m[1], m[2]);
}

// interface name -> its .d.ts file, by scanning interfaces/**
const interfaceFiles = globSync(join(sdkDir, 'interfaces/**/*.d.ts'));
const interfaceToFile = new Map();
for (const file of interfaceFiles) {
  const m = readFileSync(file, 'utf8').match(/export interface (I\w+)/);
  if (m) interfaceToFile.set(m[1], file);
}

const map = {};
let endpointCount = 0;

for (const [resource, iface] of propToInterface) {
  const file = interfaceToFile.get(iface);
  if (!file) continue;
  const src = readFileSync(file, 'utf8');

  // Each method: a /** ... */ doc block immediately followed by `methodName(` or `methodName<R = ...>(`.
  for (const m of src.matchAll(/\/\*\*([\s\S]*?)\*\/\s*(\w+)(?:<[^(]*>)?\(/g)) {
    const [, doc, method] = m;
    const endpoint = doc.match(/`(GET|POST|PUT|DELETE|PATCH)\s+([^`]+)`/);
    if (!endpoint) continue;
    const key = `${endpoint[1]} ${endpoint[2]}`;
    map[key] = `${resource}.${method}`;
    endpointCount++;
  }
}

// client.* methods (issueToken/refreshToken/revokeToken), documented directly on Nomba itself.
for (const m of readFileSync(nombaDts, 'utf8').matchAll(/\/\*\*([\s\S]*?)\*\/\s*(\w+)\(/g)) {
  const [, doc, method] = m;
  if (!['issueToken', 'refreshToken', 'revokeToken'].includes(method)) continue;
  const endpoint = doc.match(/`(GET|POST|PUT|DELETE|PATCH)\s+([^`]+)`/);
  if (!endpoint) continue;
  map[`${endpoint[1]} ${endpoint[2]}`] = `client.${method}`;
  endpointCount++;
}

// Mintlify's static server only serves files referenced in docs.json's "scripts" — a plain .json
// at the repo root 404s — so the map ships as a script that sets a global, loaded before
// try-it-dropdown.js (see docs.json).
const outPath = join(import.meta.dirname, '..', 'sdk-playground-map.js');
writeFileSync(outPath, `window.__nombaSdkPlaygroundMap = ${JSON.stringify(map, null, 2)};\n`);
console.log(`Wrote ${endpointCount} endpoint mappings to ${outPath}`);
