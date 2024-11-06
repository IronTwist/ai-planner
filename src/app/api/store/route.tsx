// Make a API connections to handle firestore

import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Add api for firestore handle' });
}
