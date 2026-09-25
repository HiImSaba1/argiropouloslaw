import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { contactSchema } from "@/lib/validation/contact";

export const runtime = "nodejs";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 5;
const attempts = new Map<string, { count: number; resetsAt: number }>();

function escapeHtml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[character] ?? character,
  );
}

function isRateLimited(key: string) {
  const now = Date.now();
  const current = attempts.get(key);
  if (!current || current.resetsAt <= now) {
    attempts.set(key, { count: 1, resetsAt: now + WINDOW_MS });
    return false;
  }
  current.count += 1;
  return current.count > MAX_REQUESTS;
}

function requiredEnvironment() {
  const values = {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || "465"),
    secure: process.env.SMTP_SECURE !== "false",
    user: process.env.SMTP_USER,
    password: process.env.SMTP_PASSWORD,
    fromEmail: process.env.SMTP_FROM_EMAIL,
    fromName: process.env.SMTP_FROM_NAME || "Fotis Argiropoulos | Best Lawyer Firm in Greece",
    toEmail: process.env.CONTACT_TO_EMAIL,
  };
  if (!values.host || !values.user || !values.password || !values.fromEmail || !values.toEmail || !Number.isInteger(values.port)) return null;
  return values as typeof values & { host: string; user: string; password: string; fromEmail: string; toEmail: string };
}

export async function POST(request: NextRequest) {
  const clientKey = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
  if (isRateLimited(clientKey)) return NextResponse.json({ message: "Πολλά αιτήματα. Δοκιμάστε ξανά αργότερα." }, { status: 429 });

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ message: "Μη έγκυρο αίτημα." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(payload);
  if (!parsed.success) return NextResponse.json({ message: "Ελέγξτε τα στοιχεία της φόρμας." }, { status: 400 });
  if (parsed.data.website) return NextResponse.json({ ok: true });

  const environment = requiredEnvironment();
  if (!environment) return NextResponse.json({ message: "Η αποστολή email δεν έχει ακόμη ρυθμιστεί." }, { status: 503 });

  const { name, email, phone, message } = parsed.data;
  const safeName = name.replace(/[\r\n]+/g, " ");
  const safeHtmlName = escapeHtml(safeName);
  const safeHtmlEmail = escapeHtml(email);
  const safeHtmlPhone = escapeHtml(phone || "—");
  const safeHtmlMessage = escapeHtml(message).replace(/\r?\n/g, "<br>");
  const transport = nodemailer.createTransport({
    host: environment.host,
    port: environment.port,
    secure: environment.secure,
    auth: { user: environment.user, pass: environment.password },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
  });

  try {
    await transport.sendMail({
      from: { name: environment.fromName, address: environment.fromEmail },
      to: environment.toEmail,
      replyTo: { name: safeName, address: email },
      subject: "Argiropouloslaw - Contact Form",
      text: [`Ονοματεπώνυμο: ${safeName}`, `Email: ${email}`, phone ? `Τηλέφωνο: ${phone}` : "Τηλέφωνο: —", "", "Μήνυμα:", message].join("\n"),
      html: `<!doctype html>
<html lang="el">
  <body style="margin:0;padding:24px;background:#f5f3ee;color:#101827;font-family:Arial,sans-serif;font-size:16px;line-height:1.6">
    <table role="presentation" style="width:100%;max-width:680px;margin:0 auto;border-collapse:collapse;background:#ffffff;border:1px solid #d9dce2">
      <tr>
        <td colspan="2" style="padding:22px 24px;background:#101f3d;color:#ffffff;font-size:20px;font-weight:700">Νέο αίτημα επικοινωνίας</td>
      </tr>
      <tr style="border-bottom:1px solid #e5e7eb">
        <td style="width:180px;padding:14px 24px;font-weight:700;vertical-align:top">Ονοματεπώνυμο</td>
        <td style="padding:14px 24px;vertical-align:top">${safeHtmlName}</td>
      </tr>
      <tr style="border-bottom:1px solid #e5e7eb">
        <td style="padding:14px 24px;font-weight:700;vertical-align:top">Email</td>
        <td style="padding:14px 24px;vertical-align:top">${safeHtmlEmail}</td>
      </tr>
      <tr style="border-bottom:1px solid #e5e7eb">
        <td style="padding:14px 24px;font-weight:700;vertical-align:top">Τηλέφωνο</td>
        <td style="padding:14px 24px;vertical-align:top">${safeHtmlPhone}</td>
      </tr>
      <tr>
        <td style="padding:14px 24px;font-weight:700;vertical-align:top">Μήνυμα</td>
        <td style="padding:14px 24px;vertical-align:top">${safeHtmlMessage}</td>
      </tr>
      <tr>
        <td colspan="2" style="padding:18px 24px;border-top:1px solid #e5e7eb;color:#5b6472;font-size:13px">Η φόρμα επικοινωνίας υποβλήθηκε μέσω του argiropouloslaw.com.</td>
      </tr>
    </table>
  </body>
</html>`,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ message: "Η αποστολή δεν ολοκληρώθηκε. Δοκιμάστε ξανά ή επικοινωνήστε τηλεφωνικά." }, { status: 502 });
  }
}
