import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminFirestore } from '@/service/adminFirebase';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('Authorization') || '';
  const token = authHeader.replace('Bearer ', '');

  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userId = decodedToken.uid;

    const notesRef = adminFirestore
      .collection('notes')
      .doc(userId)
      .collection('notes')
      .orderBy('createdAt', 'desc');

    const resp = await notesRef.get();

    const notes = resp.docs.map(doc => {
      const noteData = doc.data();
      noteData.id = doc.id;
      return noteData;
    });

    return NextResponse.json({ data: notes, error: null });
  } catch (error) {
    return NextResponse.json({ data: null, error: error });
  }
}

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('Authorization') || '';
  const token = authHeader.replace('Bearer ', '');

  try {
    const { title, content, noteId } = await req.json();

    const decodedToken = await adminAuth.verifyIdToken(token);
    const userId = decodedToken.uid;

    const noteData = {
      noteId,
      title,
      content,
      createdAt: Date.now(),
      userUid: userId,
    };

    const noteRef = adminFirestore
      .collection('notes')
      .doc(userId)
      .collection('notes')
      .doc(); // Auto-generate a unique note ID

    await noteRef.set(noteData);

    return NextResponse.json({ data: { noteData, noteRef }, error: null });
  } catch (error) {
    return NextResponse.json({ data: null, error: error });
  }
}

export async function PUT(req: NextRequest) {
  const authHeader = req.headers.get('Authorization') || '';
  const token = authHeader.replace('Bearer ', '');

  try {
    const { noteId, title, content, downloadUrl, pathname, url } =
      await req.json();

    const decodedToken = await adminAuth.verifyIdToken(token);
    const userId = decodedToken.uid;

    const noteRef = adminFirestore
      .collection('notes')
      .doc(userId)
      .collection('notes')
      .doc(noteId);

    await noteRef.update({ title, content, downloadUrl, pathname, url });

    return NextResponse.json({ data: noteRef, error: null });
  } catch (error) {
    return NextResponse.json({ data: null, error: error });
  }
}

// Example of how to add a note on front-end that I tested
// const notes = doc(firestore, `notes/${userId}/notes/${uniqueId}`);
// console.log('notes', notes);
// const resp = await setDoc(notes, noteDocData, { merge: true });
