import { NextResponse } from 'next/server';
import { sanitizeObject, validateEmail } from '@/lib/sanitize';
import { checkRateLimit, forwardToAppsScript, createEmailTransporter, buildSubmissionEmailHtml } from '@/lib/api-helpers';
import { PERSON_FIRST_NAME } from '@/lib/messages';

export async function POST(request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const sanitized = sanitizeObject(body);

    if (!sanitized.name || !sanitized.email || !sanitized.date || !sanitized.timeSlot || !sanitized.sessionType) {
      return NextResponse.json(
        { error: 'Name, email, date, time, and session type are required.' },
        { status: 400 }
      );
    }

    if (!validateEmail(sanitized.email)) {
      return NextResponse.json({ error: 'Invalid email.' }, { status: 400 });
    }

    const appsScriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
    await forwardToAppsScript(appsScriptUrl, 'booking', {
      name: sanitized.name,
      email: sanitized.email,
      phone: sanitized.phone || '',
      date: sanitized.date,
      timeSlot: sanitized.timeSlot,
      sessionType: sanitized.sessionType,
      message: sanitized.message || '',
    });

    try {
      const OWNER_EMAIL = process.env.OWNER_EMAIL;
      if (OWNER_EMAIL) {
        const transporter = await createEmailTransporter();
        if (transporter) {
          const html = buildSubmissionEmailHtml('New Booking Submission', sanitized);
          await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: OWNER_EMAIL,
            subject: 'New booking request',
            html,
          });
        }
      }
    } catch (e) {
      console.error('Failed to send booking email:', e);
    }

    return NextResponse.json(
      { message: `Your session has been booked! ${PERSON_FIRST_NAME} will confirm shortly.` },
      { status: 201 }
    );
  } catch (error) {
    console.error('Booking error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ bookedSlots: [] });
}
