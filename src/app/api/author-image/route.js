import fs from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check if a private author image URL is configured in environment variables
    const authorImageUrl = process.env.AUTHOR_IMAGE_URL;
    if (authorImageUrl) {
      const response = await fetch(authorImageUrl);
      if (response.ok) {
        const imageBuffer = Buffer.from(await response.arrayBuffer());
        return new NextResponse(imageBuffer, {
          status: 200,
          headers: {
            'Content-Type': response.headers.get('Content-Type') || 'image/jpeg',
            'Cache-Control': 'public, max-age=3600',
            'X-Content-Type-Options': 'nosniff',
          },
        });
      }
      console.error('Failed to fetch author image from URL:', response.statusText);
    }

    // Fallback to local file (e.g. for local development)
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
