import { NextResponse } from 'next/server';
import { sanitizeObject, validateEmail, validatePhone } from '@/lib/sanitize';
import { checkRateLimit, forwardToAppsScript, createEmailTransporter, buildSubmissionEmailHtml } from '@/lib/api-helpers';
import { PERSON_FIRST_NAME } from '@/lib/messages';

export async function POST(request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many submissions. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const sanitized = sanitizeObject(body);

    // Validation
    if (!sanitized.fullName || sanitized.fullName.length < 1) {
      return NextResponse.json(
        { error: 'Full name is required.' },
        { status: 400 }
      );
    }

    if (sanitized.email && !validateEmail(sanitized.email)) {
      return NextResponse.json(
        { error: 'Invalid email format.' },
        { status: 400 }
      );
    }

    if (sanitized.phone && !validatePhone(sanitized.phone)) {
      return NextResponse.json(
        { error: 'Invalid phone format.' },
        { status: 400 }
      );
    }

    // We no longer persist intake submissions to MongoDB.
    // Intakes are forwarded (Google Forms / Apps Script) and emailed to the owner.
    // Attempt to forward to Google Forms (server-side) if configured.
    try {
      const gfUrl = process.env.GOOGLE_INTAKE_RESPONSE_URL; // expected to be the formResponse endpoint
      const gfMap = process.env.GOOGLE_INTAKE_FIELD_MAP; // JSON string mapping local field -> google field name (e.g. {"fullName":"entry.12345"})
      if (gfUrl && gfMap) {
        try {
          const map = JSON.parse(gfMap);
          const params = new URLSearchParams();
          for (const [localKey, gfKey] of Object.entries(map)) {
            const val = Array.isArray(sanitized[localKey]) ? sanitized[localKey].join(', ') : (sanitized[localKey] ?? '');
            params.append(gfKey, val);
          }
          // POST as application/x-www-form-urlencoded to Google Forms
          await fetch(gfUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params.toString(),
          });
        } catch (e) {
          console.error('Google Forms forwarding failed:', e);
        }
      }
    } catch (e) {
      console.error('Error preparing Google Forms forward:', e);
    }

    const appsScriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
    if (appsScriptUrl) {
      try {
        const success = await forwardToAppsScript(appsScriptUrl, 'intake', sanitized);
        if (!success) {
          console.error('Failed to forward intake to Google Apps Script');
        }
      } catch (e) {
        console.error('Error forwarding intake to Google Apps Script:', e);
      }
    } else {
      console.warn('GOOGLE_APPS_SCRIPT_URL not configured');
    }

    try {
      const OWNER_EMAIL = process.env.OWNER_EMAIL;
      if (OWNER_EMAIL) {
        const transporter = await createEmailTransporter();
        if (transporter) {
          const html = buildSubmissionEmailHtml('New Intake Submission', sanitized);
          await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: OWNER_EMAIL,
            subject: 'New intake submission',
            html,
          });
        }
      }
    } catch (e) {
      console.error('Failed to send intake email:', e);
    }

    return NextResponse.json(
      { message: `Thank you for sharing. ${PERSON_FIRST_NAME} will reach out soon.` },
      { status: 201 }
    );
  } catch (error) {
    console.error('Intake submission error:', error);
    const isProd = process.env.NODE_ENV === 'production';
    const payload = isProd
      ? { error: 'Something went wrong. Please try again.' }
      : { error: error?.message || String(error), stack: error?.stack };
    return NextResponse.json(payload, { status: 500 });
  }
}
