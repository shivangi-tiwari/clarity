import { NextResponse } from 'next/server';
import { sanitizeObject } from '@/lib/sanitize';
import { checkRateLimit, forwardToAppsScript, createEmailTransporter, buildSubmissionEmailHtml } from '@/lib/api-helpers';
import { PERSON_FIRST_NAME } from '@/lib/messages';

const RATE_LIMIT_WINDOW = 60000;
const RATE_LIMIT_MAX = 5;

export async function POST(request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(ip, RATE_LIMIT_WINDOW, RATE_LIMIT_MAX)) {
      return NextResponse.json(
        { error: 'Too many submissions. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const sanitized = sanitizeObject(body);

    if (!sanitized.clientIdentifier) {
      return NextResponse.json(
        { error: 'Please enter your name or email.' },
        { status: 400 }
      );
    }


    // Forward to Google Apps Script
    const appsUrl = process.env.GOOGLE_SESSIONS_APPS_SCRIPT_URL || process.env.GOOGLE_APPS_SCRIPT_URL;
    if (appsUrl) {
      try {
        const success = await forwardToAppsScript(appsUrl, 'session', sanitized);
        if (!success) {
          console.error('Failed to forward session to Google Apps Script');
        }
      } catch (e) {
        console.error('Error forwarding session to Google Apps Script:', e);
      }
    }

    // Send email notification
    try {
      const OWNER_EMAIL = process.env.OWNER_EMAIL;
      if (OWNER_EMAIL) {
        const transporter = await createEmailTransporter();
        if (transporter) {
          const html = buildSubmissionEmailHtml('New Session Reflection', sanitized);
          await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: OWNER_EMAIL,
            subject: 'New session reflection submitted',
            html,
          });
        }
      }
    } catch (e) {
      console.error('Failed to send session reflection email:', e);
    }

    return NextResponse.json(
      { message: 'Your reflection has been received.' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Session submission error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Session API ready' });
}
