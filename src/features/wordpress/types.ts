export type RiskFlag =
  | "active-content"
  | "encoded-embed"
  | "external-domain"
  | "missing-title"
  | "unsupported-media";

export type WordPressRecord = {
  externalId: string;
  title: string;
  slug: string;
  type: string;
  status: string;
  sourceUrl: string;
  attachmentUrl: string | null;
  parentId: string | null;
  risks: RiskFlag[];
};

export type MediaManifestEntry = {
  externalId: string;
  title: string;
  sourceUrl: string;
  proposedPublicPath: string;
  approved: false;
  risks: RiskFlag[];
};

export type WordPressInspection = {
  generatedAt: string;
  source: {
    path: string;
    sha256: string;
    baseSiteUrl: string;
  };
  totals: {
    records: number;
    byTypeAndStatus: Record<string, number>;
    media: number;
    quarantined: number;
  };
  records: WordPressRecord[];
  mediaManifest: MediaManifestEntry[];
};
