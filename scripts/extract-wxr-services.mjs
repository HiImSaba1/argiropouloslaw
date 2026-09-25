import fs from "node:fs";

const source = process.argv[2];
if (!source) throw new Error("Pass the WordPress XML export path.");

const raw = fs.readFileSync(source, "utf8");
const item = [...raw.matchAll(/<item>([\s\S]*?)<\/item>/g)]
  .map((match) => match[1])
  .filter((block) => block.includes("<wp:post_name><![CDATA[services]]></wp:post_name>"))
  .sort((left, right) => right.length - left.length)[0];
if (!item) throw new Error("The published services page was not found in the export.");
const encodedBlock = item.match(/<content:encoded>([\s\S]*?)<\/content:encoded>/)?.[1] ?? "";
const content = [...encodedBlock.matchAll(/<!\[CDATA\[([\s\S]*?)\]\]>/g)].map((match) => match[1]).join("");

const services = Array.from({ length: 8 }, (_, index) => {
  const section = index + 1;
  const start = content.indexOf(`el_id="services-section-${section}"`);
  const end = section < 8 ? content.indexOf(`el_id="services-section-${section + 1}"`) : content.length;
  const block = content.slice(start, end);
  const heading = [...block.matchAll(/<h2[^>]*><strong>(.*?)<\/strong><\/h2>/g)][0]?.[1] ?? "";
  const entries = [...block.matchAll(/\[bsf-info-box[^\]]*title="([^"]+)"[^\]]*\]([\s\S]*?)\[\/bsf-info-box\]/g)].map((match) => ({
    title: match[1],
    body: (match[2].match(/<h6[^>]*>([\s\S]*?)<\/h6>/)?.[1] ?? "").replace(/<[^>]+>/g, "").replaceAll("&nbsp;", " ").trim(),
  }));
  return { section, heading, entries };
});

process.stdout.write(`${JSON.stringify(services, null, 2)}\n`);
