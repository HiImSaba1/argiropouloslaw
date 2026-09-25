const checks = [];

function add(name, ok, detail) {
  checks.push({ name, ok, detail });
}

function present(name) {
  return typeof process.env[name] === "string" && process.env[name].trim().length > 0;
}

const nodeMajor = Number(process.versions.node.split(".")[0]);
add("node_runtime", nodeMajor === 22, `Node ${process.versions.node}; production requires Node.js 22`);

let canonicalSafe = false;
try {
  const canonical = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "");
  canonicalSafe = canonical.protocol === "https:" && canonical.hostname === "argiropouloslaw.com";
} catch {}
add("canonical_url", canonicalSafe, canonicalSafe ? "Canonical HTTPS domain is configured" : "NEXT_PUBLIC_SITE_URL must be https://argiropouloslaw.com");

const smtpPort = Number(process.env.SMTP_PORT);
const smtpSafe = present("SMTP_HOST") && present("SMTP_USER") && present("SMTP_PASSWORD") && present("SMTP_FROM_EMAIL") && present("CONTACT_TO_EMAIL") && smtpPort === 465 && process.env.SMTP_SECURE === "true";
add("contact_smtp", smtpSafe, smtpSafe ? "Authenticated SMTP over implicit TLS is configured" : "SMTP credentials, sender, recipient, secure port 465 are required");

let databaseStatus = "Database is not required by the current public application";
let databaseSafe = true;
if (present("DATABASE_URL")) {
  try {
    const database = new URL(process.env.DATABASE_URL);
    databaseSafe = database.protocol === "mysql:" && Boolean(database.hostname && database.username) && decodeURIComponent(database.pathname.slice(1)) === "next_argiropouloslaw";
    databaseStatus = databaseSafe ? "Optional MySQL URL targets next_argiropouloslaw" : "DATABASE_URL is present but does not target the expected MySQL database";
  } catch {
    databaseSafe = false;
    databaseStatus = "DATABASE_URL is present but malformed";
  }
}
add("database_configuration", databaseSafe, databaseStatus);

console.log("Argiropoulos Law production preflight (no secret values are printed)");
for (const check of checks) console.log(`${check.ok ? "PASS" : "ATTENTION"} - ${check.name}: ${check.detail}`);
if (checks.some((check) => !check.ok)) process.exitCode = 1;
