import { createHash } from "node:crypto";
import { mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";
import sharp from "sharp";
import type { MediaManifestEntry } from "../src/features/wordpress/types";

type ReviewedMedia = Omit<MediaManifestEntry, "approved"> & { approved: boolean };

function argument(name: string) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

async function main() {
  if (!process.argv.includes("--execute")) {
    throw new Error("Dry-run guard: add --execute only after reviewing and approving exact entries in the manifest.");
  }

  const manifestPath = resolve(argument("--manifest") ?? "artifacts/wordpress/media-manifest.json");
const publicRoot = resolve("public");
const imageRoot = resolve(publicRoot, "images");
const stagingRoot = resolve(imageRoot, ".staging");
const manifest = JSON.parse(await readFile(manifestPath, "utf8")) as ReviewedMedia[];
const approved = manifest.filter((entry) => entry.approved);
if (approved.length === 0) throw new Error("The reviewed manifest contains no approved media entries.");

const report: Array<Record<string, unknown>> = [];
await mkdir(stagingRoot, { recursive: true });

for (const entry of approved) {
  const destination = resolve(publicRoot, entry.proposedPublicPath.replace(/^\/+/, ""));
  const relativeDestination = relative(imageRoot, destination);
  if (relativeDestination.startsWith("..") || relativeDestination.includes(":")) {
    throw new Error(`Rejected destination outside public/images: ${entry.proposedPublicPath}`);
  }
  const url = new URL(entry.sourceUrl);
  if (url.protocol !== "https:") throw new Error(`Only HTTPS media sources are accepted: ${entry.sourceUrl}`);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30_000);
  const response = await fetch(url, { redirect: "follow", signal: controller.signal });
  clearTimeout(timeout);
  if (!response.ok) throw new Error(`Download failed (${response.status}) for ${entry.sourceUrl}`);
  const contentLength = Number(response.headers.get("content-length") || "0");
  if (contentLength > 25 * 1024 * 1024) throw new Error(`Media exceeds 25 MB: ${entry.sourceUrl}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.byteLength > 25 * 1024 * 1024) throw new Error(`Media exceeds 25 MB: ${entry.sourceUrl}`);

  const metadata = await sharp(bytes, { failOn: "error" }).metadata();
  const temporary = resolve(stagingRoot, `${entry.externalId}-${Date.now()}`);
  await writeFile(temporary, bytes);
  await mkdir(dirname(destination), { recursive: true });
  await rm(destination, { force: true });
  await rename(temporary, destination);
  report.push({
    externalId: entry.externalId,
    sourceUrl: entry.sourceUrl,
    publicPath: entry.proposedPublicPath,
    sha256: createHash("sha256").update(bytes).digest("hex"),
    byteSize: bytes.byteLength,
    width: metadata.width ?? null,
    height: metadata.height ?? null,
    format: metadata.format ?? null,
  });
}

await writeFile(resolve(dirname(manifestPath), "download-report.json"), `${JSON.stringify({ downloadedAt: new Date().toISOString(), files: report }, null, 2)}\n`, "utf8");
  process.stdout.write(`Downloaded and verified ${report.length} approved media files.\n`);
}

main().catch((error) => {
  process.stderr.write(`Media download failed: ${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
