import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { inspectWordPressXml } from "../src/features/wordpress/inspect";

function argument(name: string) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

async function main() {
  const source = resolve(argument("--source") ?? "../fotiosargiropoulos.WordPress.2026-09-25.xml");
  const outputDirectory = resolve(argument("--output") ?? "artifacts/wordpress");
  const xml = await readFile(source, "utf8");
  const sha256 = createHash("sha256").update(xml).digest("hex");
  const inspection = inspectWordPressXml(xml, { sourcePath: source, sha256 });

  await mkdir(outputDirectory, { recursive: true });
  await writeFile(resolve(outputDirectory, "inspection.json"), `${JSON.stringify(inspection, null, 2)}\n`, "utf8");
  await writeFile(resolve(outputDirectory, "media-manifest.json"), `${JSON.stringify(inspection.mediaManifest, null, 2)}\n`, "utf8");

  const counts = Object.entries(inspection.totals.byTypeAndStatus)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([key, count]) => `| ${key} | ${count} |`)
  .join("\n");
  const pages = inspection.records
  .filter((record) => record.type === "page" && record.status === "publish")
  .map((record) => `| ${record.title || "(missing)"} | ${record.slug || "(missing)"} | ${record.risks.join(", ") || "none"} |`)
  .join("\n");
  const logoCandidates = inspection.mediaManifest
  .filter((record) => record.proposedPublicPath.startsWith("/images/logo/"))
  .map((record) => `| ${record.externalId} | ${record.title} | ${record.proposedPublicPath} | ${record.risks.join(", ") || "none"} |`)
  .join("\n");

  const summary = `# WordPress inspection\n\n- Source: \`${source}\`\n- SHA-256: \`${sha256}\`\n- Writes to database or public content: **none**\n- Total records: **${inspection.totals.records}**\n- Media attachments: **${inspection.totals.media}**\n- Records requiring review: **${inspection.totals.quarantined}**\n\n## Record counts\n\n| Type and status | Count |\n| --- | ---: |\n${counts}\n\n## Published pages\n\n| Title | Legacy slug | Risks |\n| --- | --- | --- |\n${pages}\n\n## Logo and icon candidates\n\n| WordPress ID | Title | Proposed local path | Risks |\n| --- | --- | --- | --- |\n${logoCandidates || "| - | No candidate found | - | - |"}\n\n## Media gate\n\nEvery entry in \`media-manifest.json\` starts with \`approved: false\`. Review and approve exact records before running the downloader with \`--execute\`. The downloader rejects paths outside \`public/images\`.\n`;

  await writeFile(resolve(outputDirectory, "inspection.md"), summary, "utf8");
  process.stdout.write(`WordPress inspection complete: ${inspection.totals.records} records, ${inspection.totals.media} media, ${inspection.totals.quarantined} requiring review.\n`);
}

main().catch((error) => {
  process.stderr.write(`WordPress inspection failed: ${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
