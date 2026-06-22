const rateLimitMap = new Map();
const DEFAULT_RATE_LIMIT_WINDOW = 60000;
const DEFAULT_RATE_LIMIT_MAX = 5;

export function checkRateLimit(ip, windowMs = DEFAULT_RATE_LIMIT_WINDOW, maxRequests = DEFAULT_RATE_LIMIT_MAX) {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  if (!record || now - record.timestamp > windowMs) {
    rateLimitMap.set(ip, { count: 1, timestamp: now });
    return true;
  }
  if (record.count >= maxRequests) return false;
  record.count++;
  return true;
}

export async function forwardToAppsScript(appsScriptUrl, formType, payload) {
  if (!appsScriptUrl) return null;
  
  try {
    const resp = await fetch(appsScriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ formType, ...payload }),
    });
    return resp.ok;
  } catch (err) {
    console.error(`Failed to forward ${formType} to Google Apps Script:`, err);
    return false;
  }
}

export async function sendOwnerEmail(transporterFn, { to, subject, html }) {
  if (!to) {
    console.error('Owner email address not configured');
    return false;
  }

  try {
    const transporter = await transporterFn();
    if (!transporter) return false;

    await transporter.sendMail({ to, subject, html });
    return true;
  } catch (err) {
    console.error('Failed to send email:', err);
    return false;
  }
}

export async function createEmailTransporter() {
  const SMTP_HOST = process.env.SMTP_HOST;
  const SMTP_PORT = process.env.SMTP_PORT;
  const SMTP_USER = process.env.SMTP_USER;
  const SMTP_PASS = process.env.SMTP_PASS;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    return null;
  }

  try {
    const nodemailer = (await import('nodemailer')).default;
    return nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT ? parseInt(SMTP_PORT, 10) : 587,
      secure: SMTP_PORT === '465',
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
  } catch (err) {
    console.error('Failed to create email transporter:', err);
    return null;
  }
}

export function buildSubmissionEmailHtml(title, sanitizedObject) {
  const htmlLines = [];
  htmlLines.push(`<h2>${title}</h2>`);
  htmlLines.push('<ul>');
  for (const [k, v] of Object.entries(sanitizedObject)) {
    const val = Array.isArray(v) ? v.join(', ') : (v ?? '');
    htmlLines.push(`<li><strong>${k}:</strong> ${String(val)}</li>`);
  }
  htmlLines.push('</ul>');
  return htmlLines.join('\n');
}
