import { adminAuth, adminFirestore } from '@/service/adminFirebase';
import { Note } from '@/store/reducers/notes-slice';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const id = req.url.split('/').pop();

  const authHeader = req.headers.get('Authorization') || '';
  const token = authHeader.replace('Bearer ', '');

  if (!id) {
    return NextResponse.json({ data: null, error: 'No id provided' });
  }

  const decodedToken = await adminAuth.verifyIdToken(token);
  const userId = decodedToken.uid;

  const noteRef = adminFirestore
    .collection('notes')
    .doc(userId)
    .collection('notes')
    .doc(id);

  const resp = await noteRef.get();
  const note = resp.data();

  if (!note) {
    return NextResponse.json({ data: null, error: 'Note not found' });
  }

  return NextResponse.json({ data: note, error: null });
}

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

export async function PUT(req: Request) {
  const id = req.url.split('/').pop();
  const { title, content, downloadUrl, pathname, url } =
    (await req.json()) as Note;

  const authHeader = req.headers.get('Authorization') || '';
  const token = authHeader.replace('Bearer ', '');

  if (!id) {
    return NextResponse.json({ data: null, error: 'No id provided' });
  }

  const decodedToken = await adminAuth.verifyIdToken(token);
  const userId = decodedToken.uid;

  const noteRef = adminFirestore
    .collection('notes')
    .doc(userId)
    .collection('notes')
    .doc(id);

  const note = await noteRef.get();

  if (!note.exists) {
    return NextResponse.json({ data: null, error: 'Note not found' });
  }

  const noteData = {
    title,
    content,
    downloadUrl,
    pathname,
    url,
  };

  try {
    await noteRef.update(noteData);
  } catch (error) {
    return NextResponse.json({ data: null, error: error });
  }

  return NextResponse.json({ data: noteRef, error: null });
}
