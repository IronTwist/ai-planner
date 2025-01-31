import { NextResponse } from 'next/server';
import { adminAuth, adminFirestore } from '@/service/adminFirebase';

export async function GET(request: Request) {
  // const id = request.url.split('/').pop();

  const authHeader = request.headers.get('Authorization') || '';
  const token = authHeader.replace('Bearer ', '');

  // if (!id) {
  //   return NextResponse.json({ data: null, error: 'No id provided' });
  // }

  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userId = decodedToken.uid;

    const pushupsRef = adminFirestore
      .collection('notes')
      .doc(userId)
      .collection('pushups')
      .orderBy('date', 'desc');

    const resp = await pushupsRef.get();

    const pushups = resp.docs.map(doc => {
      const pushData = doc.data();
      pushData.id = doc.id;
      return pushData;
    });

    console.log('PushData--------> ', pushups);

    if (!pushups) {
      return NextResponse.json({ data: [], error: 'Data not found' });
    }

    return NextResponse.json({ data: pushups, error: null });
  } catch (error) {
    return NextResponse.json({ data: [], error });
  }
}

export async function POST(request: Request) {
  const { name, programLevel, set1, set2, set3, set4, set5, date, total } =
    await request.json();

  if (!name) {
    return NextResponse.json({ message: 'Invalid data.' });
  }

  const authHeader = request.headers.get('Authorization') || '';
  const token = authHeader.replace('Bearer ', '');

  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userId = decodedToken.uid;

    const workoutData = {
      date,
      name,
      total,
      programLevel,
      set1,
      set2,
      set3,
      set4,
      set5,
    };

    const noteRef = adminFirestore
      .collection('notes')
      .doc(userId)
      .collection('pushups')
      .doc(); // Auto-generate a unique note ID

    await noteRef.set(workoutData);

    return NextResponse.json({ data: { workoutData, noteRef }, error: null });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { id } = await request.json();

  const authHeader = request.headers.get('Authorization') || '';
  const token = authHeader.replace('Bearer ', '');

  if (!id) {
    return NextResponse.json({ data: null, error: 'No id provided' });
  }

  const decodedToken = await adminAuth.verifyIdToken(token);
  const userId = decodedToken.uid;

  const resp = await adminFirestore
    .collection('notes')
    .doc(userId)
    .collection('pushups')
    .doc(id)
    .delete();

  if (!resp) {
    return NextResponse.json({ data: null, error: 'Note not found' });
  }

  return NextResponse.json({ message: 'Delete row' });
}
