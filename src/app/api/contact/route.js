import { NextResponse } from 'next/server';
import { sanitizeObject, validateEmail } from '@/lib/sanitize';
import { checkRateLimit, forwardToAppsScript, createEmailTransporter, buildSubmissionEmailHtml } from '@/lib/api-helpers';
import { PERSON_FIRST_NAME } from '@/lib/messages';

export async function POST(request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many messages. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const sanitized = sanitizeObject(body);

    if (!sanitized.name || !sanitized.message) {
      return NextResponse.json(
        { error: 'Name and message are required.' },
        { status: 400 }
      );
    }

    if (sanitized.email && !validateEmail(sanitized.email)) {
      return NextResponse.json(
        { error: 'Invalid email format.' },
        { status: 400 }
      );
    }

    const appsScriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
    if (appsScriptUrl) {
      try {
        await forwardToAppsScript(appsScriptUrl, 'contact', {
          name: sanitized.name,
          email: sanitized.email,
          message: sanitized.message,
        });
      } catch (e) {
        console.error('Failed to forward to Apps Script:', e);
      }
    }

    try {
      const OWNER_EMAIL = process.env.OWNER_EMAIL;
      if (OWNER_EMAIL) {
        const transporter = await createEmailTransporter();
        if (transporter) {
          const html = buildSubmissionEmailHtml('New Contact Message', sanitized);
          await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: OWNER_EMAIL,
            subject: 'New contact message',
            html,
          });
        }
      }
    } catch (e) {
      console.error('Failed to send email:', e);
    }

    return NextResponse.json(
      { message: `Thank you for reaching out. ${PERSON_FIRST_NAME} will be in touch soon.` },
      { status: 201 }
    );
  } catch (error) {
    console.error('Contact submission error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
