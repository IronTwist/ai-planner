import { adminAuth, adminFirestore } from '@/service/adminFirebase';
import { NextResponse } from 'next/server';

export async function DELETE(req: Request) {
  const id = req.url.split('/').pop();

  const authHeader = req.headers.get('Authorization') || '';
  const token = authHeader.replace('Bearer ', '');

  if (!id) {
    return NextResponse.json({ data: null, error: 'No id provided' });
  }

  const decodedToken = await adminAuth.verifyIdToken(token);
  const userId = decodedToken.uid;

  const resp = await adminFirestore
    .collection('notes')
    .doc(userId)
    .collection('notes')
    .doc(id)
    .delete();

  if (!resp) {
    return NextResponse.json({ data: null, error: 'Note not found' });
  }

  return NextResponse.json({ data: resp, error: null });
}
