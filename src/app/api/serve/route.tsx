import { cache } from '@/session/server-sessions';
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ cache });
}

// // try {
//addDoc not workig
//   // const docRef = await addDoc(collection(firestoreDatabase, 'users'), {
//   //   email: dataForSession.email,
//   //   name: dataForSession.userName,
//   //   uid: dataForSession.uid,
//   // });

//   const usersCollection = collection(firestore, `users`);

// Write the new user to the database

// 1. This works
// const docRef = await setDoc(
//   doc(firestore, 'users', dataForSession.uid),
//   {
//     email: dataForSession.email,
//     name: dataForSession.userName,
//     uid: dataForSession.uid,
//   },
// );

// 2. This works
// const users = doc(firestore, `users/${dataForSession.uid}`);

// const docData = {
//   email: dataForSession.email,
//   name: dataForSession.userName,
//   uid: dataForSession.uid,
// };

// setDoc(users, docData, { merge: true });

//   console.log('Document written with ID: ');
// } catch (e) {
//   console.error('Error adding document: ', e);
// }
