import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { clientId, email, fullName, ownerNotes } = body;

    if (!clientId || !ownerNotes) {
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
        action: 'updateClientNotes',
        clientId,
        email,
        fullName,
        ownerNotes,
      }),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Failed to save notes' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Failed to save notes:', err);
    return NextResponse.json(
      { error: 'Failed to save notes' },
      { status: 500 }
    );
  }
}
