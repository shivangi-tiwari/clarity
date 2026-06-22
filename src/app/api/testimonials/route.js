import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { sanitizeObject } from '@/lib/sanitize';
import { forwardToAppsScript, createEmailTransporter, buildSubmissionEmailHtml } from '@/lib/api-helpers';

const DATA_PATH = path.join(process.cwd(), 'data', 'testimonials.json');

async function readStore() {
  try {
    const txt = await fs.readFile(DATA_PATH, 'utf8');
    return JSON.parse(txt || '[]');
  } catch (e) {
    return [];
  }
}

async function writeStore(arr) {
  await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
  await fs.writeFile(DATA_PATH, JSON.stringify(arr, null, 2), 'utf8');
}

export async function GET() {
  try {
    const appsScriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
    if (appsScriptUrl) {
      try {
        const url = `${appsScriptUrl}?action=getTestimonials`;
        // Fetch testimonials from Google Apps Script Web App
        const res = await fetch(url, { cache: 'no-store' });
        if (res.ok) {
          const all = await res.json();
          if (Array.isArray(all)) {
            // Normalize incoming records (some Apps Script deployments return different header keys)
            const normalize = (r) => {
              const get = (...keys) => {
                for (const k of keys) {
                  if (r[k] !== undefined && r[k] !== null && String(r[k]).trim() !== '') return String(r[k]).trim();
                }
                return '';
              };

              const quote = get('quote', 'Quote', 'Testimonial Quote', 'Testimonial', 'testimonial', 'Feedback', 'feedback', 'Message', 'message');
              const name = get('name', 'Name', 'Client Name', 'Full Name', 'fullName', 'Preferred Name') || 'Anonymous';
              const context = get('context', 'Context', 'Context (e.g. Coaching Journey Client)', 'Session Type') || 'Client';
              const approvedVal = get('approved', 'Approved', 'Approved (TRUE/FALSE)', 'Status');

              const approved = (String(approvedVal).trim().toLowerCase() === 'false' || String(approvedVal).trim().toLowerCase() === 'f' || String(approvedVal).trim().toLowerCase() === 'no' || String(approvedVal).trim().toLowerCase() === 'n') ? false : true;

              return {
                id: r.id || r.ID || r['ID'] || Math.random().toString(36).slice(2, 9),
                name,
                context,
                quote,
                approved,
              };
            };

            const mapped = all.map(normalize);
            const approved = mapped.filter(t => t.approved);
            if (approved.length > 0) {
              return NextResponse.json(approved);
            }
          }
        }
      } catch (err) {
        console.error('Failed to fetch testimonials from Google Sheets, falling back to local JSON store:', err);
      }
    }

    // Fallback: fetch from local JSON file
    const all = await readStore();
    const approved = all.filter(t => t.approved);
    return NextResponse.json(approved);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const sanitized = sanitizeObject(body);
    if (!sanitized.quote || sanitized.quote.length < 10) {
      return NextResponse.json({ error: 'Please provide a longer testimonial.' }, { status: 400 });
    }
    const entry = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
      quote: sanitized.quote,
      name: sanitized.name || 'Anonymous',
      context: sanitized.context || '',
      approved: false,
      createdAt: new Date().toISOString(),
    };

    // 1. Save to local JSON store as fallback
    const all = await readStore();
    all.unshift(entry);
    await writeStore(all);

    const appsScriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
    const appsScriptForwarded = await forwardToAppsScript(appsScriptUrl, 'testimonial', entry);

    try {
      const OWNER_EMAIL = process.env.OWNER_EMAIL;
      if (OWNER_EMAIL) {
        const transporter = await createEmailTransporter();
        if (transporter) {
          const html = `<h3>New testimonial submission</h3>
            <p><strong>${entry.name}</strong> — ${entry.context}</p>
            <blockquote>${entry.quote}</blockquote>
            <p><strong>Forwarded to Google Sheets:</strong> ${appsScriptForwarded ? 'Yes' : 'No'}</p>
            <p>To approve, go to your Google Sheet "Testimonials" tab and set the "Approved" column to TRUE.</p>`;

          await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: OWNER_EMAIL,
            subject: 'New testimonial submitted',
            html,
          });
        }
      }
    } catch (e) {
      console.error('Failed sending testimonial email', e);
    }

    return NextResponse.json({ message: 'Thanks — testimonial submitted for approval.' }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
