import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";

const projectRoot = process.cwd();
const standaloneRoot = join(projectRoot, ".next", "standalone");
const staticSource = join(projectRoot, ".next", "static");
const staticTarget = join(standaloneRoot, ".next", "static");
const publicSource = join(projectRoot, "public");
const publicTarget = join(standaloneRoot, "public");

if (!existsSync(join(standaloneRoot, "server.js"))) {
  throw new Error("Standalone server was not generated. Confirm next.config.ts uses output: 'standalone'.");
}

for (const [source, target] of [[staticSource, staticTarget], [publicSource, publicTarget]]) {
  if (!existsSync(source)) throw new Error(`Required build source is missing: ${source}`);
  rmSync(target, { force: true, recursive: true });
  mkdirSync(target, { recursive: true });
  cpSync(source, target, { recursive: true });
}

console.log("Standalone runtime prepared with public and .next/static assets.");
