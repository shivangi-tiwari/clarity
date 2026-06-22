import fs from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const imagePath = path.join(process.cwd(), 'public', 'author.jpg');
    const imageBuffer = await fs.readFile(imagePath);

    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=3600',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    console.error('Failed to load author image:', error);
    return NextResponse.json(
      { error: 'Author image not found' },
      { status: 404 }
    );
  }
}
