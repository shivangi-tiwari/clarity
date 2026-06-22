import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { sessionId, email, sessionNotes } = body;

    if (!sessionId || !sessionNotes) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const appsScriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
    if (!appsScriptUrl) {
      return NextResponse.json(
        { error: 'Apps Script URL not configured' },
        { status: 500 }
      );
    }

    const res = await fetch(appsScriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'updateSessionNotes',
        sessionId,
        email,
        sessionNotes,
      }),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Failed to save session notes' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Failed to save session notes:', err);
    return NextResponse.json(
      { error: 'Failed to save session notes' },
      { status: 500 }
    );
  }
}
