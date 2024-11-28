import { del, put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename') as string;
  if (request.body) {
    const blob = await put(filename, request.body, {
      access: 'public',
    });

    return NextResponse.json(blob);
  }
}

export async function DELETE(request: Request) {
  const { url } = await request.json();

  try {
    await del(url);
  } catch (error) {
    return NextResponse.json({ data: null, error: error });
  }
  return NextResponse.json({ data: 'Delete successfully', error: null });
}

export async function GET(request: Request) {
  // get URL from request
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url') as string;

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  try {
    // Fetch the image from the provided URL
    const resp = await fetch(url);

    if (!resp.ok) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    // Get the image content type
    const contentType = resp.headers.get('Content-Type');

    // Return the image data directly with proper headers
    const imageBuffer = await resp.arrayBuffer();
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType || 'application/octet-stream',
        'Content-Length': resp.headers.get('Content-Length') || '',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Error fetching image:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
