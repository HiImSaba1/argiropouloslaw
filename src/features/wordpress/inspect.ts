import { XMLParser } from "fast-xml-parser";
import type {
  MediaManifestEntry,
  RiskFlag,
  WordPressInspection,
  WordPressRecord,
} from "./types";

const supportedMedia = new Set(["jpg", "jpeg", "png", "webp", "svg"]);

function text(value: unknown): string {
  if (typeof value === "string" || typeof value === "number") return String(value).trim();
  if (value && typeof value === "object" && "#text" in value) {
    return text((value as { "#text": unknown })["#text"]);
  }
  return "";
}

function list<T>(value: T | T[] | undefined): T[] {
  if (value === undefined) return [];
  return Array.isArray(value) ? value : [value];
}

function asciiSlug(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "media";
}

function proposedPath(urlValue: string, title: string) {
  const url = new URL(urlValue);
  const sourceName = decodeURIComponent(url.pathname.split("/").pop() || "media");
  const dot = sourceName.lastIndexOf(".");
  const extension = dot >= 0 ? sourceName.slice(dot + 1).toLowerCase() : "bin";
  const base = asciiSlug(dot >= 0 ? sourceName.slice(0, dot) : title);
  const haystack = `${title} ${sourceName}`.toLowerCase();
  const folder = /logo|favicon|monogram|icon/.test(haystack) ? "logo" : "migration";
  return `/images/${folder}/${base}.${extension}`;
}

export function inspectWordPressXml(
  xml: string,
  input: { sourcePath: string; sha256: string; generatedAt?: string },
): WordPressInspection {
  const parser = new XMLParser({ ignoreAttributes: false, trimValues: false });
  const parsed = parser.parse(xml) as Record<string, unknown>;
  const channel = (parsed.rss as { channel?: Record<string, unknown> } | undefined)?.channel;
  if (!channel) throw new Error("The source is not a readable WordPress WXR export.");

  const baseSiteUrl = text(channel["wp:base_site_url"] || channel.link);
  const baseOrigin = baseSiteUrl ? new URL(baseSiteUrl).origin : "";
  const records: WordPressRecord[] = [];

  for (const rawValue of list(channel.item as Record<string, unknown> | Record<string, unknown>[] | undefined)) {
    const raw = rawValue as Record<string, unknown>;
    const title = text(raw.title);
    const sourceUrl = text(raw.link);
    const attachmentUrl = text(raw["wp:attachment_url"]) || null;
    const html = text(raw["content:encoded"]);
    const risks = new Set<RiskFlag>();

    if (!title) risks.add("missing-title");
    if (/<(?:script|iframe|object|embed)\b|\bon\w+\s*=/i.test(html)) risks.add("active-content");
    if (/%3C(?:iframe|script)|JTN[Dd]/.test(html)) risks.add("encoded-embed");
    if (sourceUrl && baseOrigin && new URL(sourceUrl).origin !== baseOrigin) risks.add("external-domain");
    if (attachmentUrl) {
      const extension = new URL(attachmentUrl).pathname.split(".").pop()?.toLowerCase() || "";
      if (!supportedMedia.has(extension)) risks.add("unsupported-media");
    }

    records.push({
      externalId: text(raw["wp:post_id"]),
      title,
      slug: text(raw["wp:post_name"]),
      type: text(raw["wp:post_type"]),
      status: text(raw["wp:status"]),
      sourceUrl,
      attachmentUrl,
      parentId: text(raw["wp:post_parent"]) || null,
      risks: [...risks],
    });
  }

  const byTypeAndStatus: Record<string, number> = {};
  for (const record of records) {
    const key = `${record.type}|${record.status}`;
    byTypeAndStatus[key] = (byTypeAndStatus[key] || 0) + 1;
  }

  const mediaManifest: MediaManifestEntry[] = records
    .filter((record) => record.type === "attachment" && record.attachmentUrl)
    .map((record) => ({
      externalId: record.externalId,
      title: record.title,
      sourceUrl: record.attachmentUrl!,
      proposedPublicPath: proposedPath(record.attachmentUrl!, record.title),
      approved: false,
      risks: record.risks,
    }));

  const destinationCounts = new Map<string, number>();
  for (const entry of mediaManifest) {
    destinationCounts.set(entry.proposedPublicPath, (destinationCounts.get(entry.proposedPublicPath) || 0) + 1);
  }
  for (const entry of mediaManifest) {
    if ((destinationCounts.get(entry.proposedPublicPath) || 0) < 2) continue;
    const dot = entry.proposedPublicPath.lastIndexOf(".");
    entry.proposedPublicPath = dot < 0
      ? `${entry.proposedPublicPath}-${entry.externalId}`
      : `${entry.proposedPublicPath.slice(0, dot)}-${entry.externalId}${entry.proposedPublicPath.slice(dot)}`;
  }

  return {
    generatedAt: input.generatedAt ?? new Date().toISOString(),
    source: { path: input.sourcePath, sha256: input.sha256, baseSiteUrl },
    totals: {
      records: records.length,
      byTypeAndStatus,
      media: mediaManifest.length,
      quarantined: records.filter((record) => record.risks.length > 0).length,
    },
    records,
    mediaManifest,
  };
}
