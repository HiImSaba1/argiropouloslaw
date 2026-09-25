const origin = new URL(process.env.PRODUCTION_SITE_URL ?? "https://argiropouloslaw.com");
const checks = [
  { path: "/api/health/live", type: "json" },
  { path: "/", contains: "Φώτιος" },
  { path: "/ypiresies", contains: "Νομικές Υπηρεσίες" },
  { path: "/epikoinonia", contains: "Επικοινωνία" },
];

let failed = false;
for (const check of checks) {
  const url = new URL(check.path, origin);
  try {
    const response = await fetch(url, { redirect: "follow", signal: AbortSignal.timeout(10_000) });
    const body = await response.text();
    const contentOk = check.type === "json"
      ? response.headers.get("content-type")?.includes("application/json") && JSON.parse(body).ok === true
      : body.includes(check.contains);
    const ok = response.ok && contentOk;
    console.log(`${ok ? "PASS" : "FAIL"} - ${check.path}: HTTP ${response.status}`);
    if (!ok) failed = true;
  } catch (error) {
    failed = true;
    console.log(`FAIL - ${check.path}: ${error instanceof Error ? error.message : "request failed"}`);
  }
}

if (failed) process.exitCode = 1;
