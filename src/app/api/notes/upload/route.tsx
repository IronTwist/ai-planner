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
