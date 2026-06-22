import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const appsScriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
    if (!appsScriptUrl) {
      return NextResponse.json(
        { error: 'Apps Script URL not configured' },
        { status: 500 }
      );
    }

    const res = await fetch(`${appsScriptUrl}?action=getClients`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch clients from Google Sheets' },
        { status: 500 }
      );
    }

    const clients = await res.json();
    return NextResponse.json(clients);
  } catch (err) {
    console.error('Failed to fetch clients:', err);
    return NextResponse.json(
      { error: 'Failed to fetch clients' },
      { status: 500 }
    );
  }
}
