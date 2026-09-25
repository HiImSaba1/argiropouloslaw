import { describe, expect, it } from "vitest";
import { inspectWordPressXml } from "./inspect";

const fixture = `<?xml version="1.0"?><rss xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:wp="http://wordpress.org/export/1.2/"><channel><link>https://example.test</link><wp:base_site_url>https://example.test</wp:base_site_url><item><title>Logo</title><link>https://example.test/?attachment_id=2</link><content:encoded></content:encoded><wp:post_id>2</wp:post_id><wp:post_parent>0</wp:post_parent><wp:post_name>logo</wp:post_name><wp:status>inherit</wp:status><wp:post_type>attachment</wp:post_type><wp:attachment_url>https://example.test/wp-content/uploads/2026/logo.png</wp:attachment_url></item><item><title>Contact</title><link>https://example.test/contact/</link><content:encoded><![CDATA[<iframe src="https://maps.example"></iframe>]]></content:encoded><wp:post_id>3</wp:post_id><wp:post_parent>0</wp:post_parent><wp:post_name>contact</wp:post_name><wp:status>publish</wp:status><wp:post_type>page</wp:post_type></item></channel></rss>`;

describe("inspectWordPressXml", () => {
  it("creates a review-only local media mapping and flags active content", () => {
    const result = inspectWordPressXml(fixture, {
      sourcePath: "fixture.xml",
      sha256: "abc",
      generatedAt: "2026-09-25T00:00:00.000Z",
    });

    expect(result.totals.records).toBe(2);
    expect(result.mediaManifest).toEqual([
      expect.objectContaining({
        proposedPublicPath: "/images/logo/logo.png",
        approved: false,
      }),
    ]);
    expect(result.records[1].risks).toContain("active-content");
  });

  it("makes duplicate legacy filenames collision-safe", () => {
    const duplicated = fixture.replace(
      "</channel>",
      "<item><title>Logo copy</title><link>https://example.test/?attachment_id=4</link><wp:post_id>4</wp:post_id><wp:post_parent>0</wp:post_parent><wp:post_name>logo-copy</wp:post_name><wp:status>inherit</wp:status><wp:post_type>attachment</wp:post_type><wp:attachment_url>https://example.test/wp-content/uploads/2025/logo.png</wp:attachment_url></item></channel>",
    );
    const result = inspectWordPressXml(duplicated, { sourcePath: "fixture.xml", sha256: "abc" });
    expect(result.mediaManifest.map((entry) => entry.proposedPublicPath)).toEqual([
      "/images/logo/logo-2.png",
      "/images/logo/logo-4.png",
    ]);
  });
});
