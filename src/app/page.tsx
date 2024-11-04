'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logOut } from '@/store/reducers/auth-slice';
import { AppDispatch } from '@/store/store';
import Link from 'next/link';
import firebase from '@/service/client/firebase';
import { deleteCookie, setCookie } from '@/session/client-session';

firebase.auth().onAuthStateChanged(user => {
  console.log('User: ----->', user);
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    const uid = user.uid;
    console.log('USer UID: ', uid);
  }
});

export default function Home() {
  const user = useAppSelector(state => state.auth.user);
  const loading = useAppSelector(state => state.auth.loading);
  const dispatch = useAppDispatch<AppDispatch>();
  return (
    <div className='grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]'>
      <main className='flex flex-col gap-8 row-start-2 items-center sm:items-start'>
        <h1 className='text-4xl font-bold'>Ai Planner</h1>
        <h3>Username: {!loading && user?.userName}</h3>
        {user ? (
          <div>
            <h2 className='text-2xl font-bold'>Welcome {user.userName}!</h2>
            <Link
              href='/'
              onClick={() => {
                firebase.auth().signOut();
                dispatch(logOut());
                deleteCookie('ai-planner-session');
                console.log('User logged out');
              }}
            >
              Logout
            </Link>
          </div>
        ) : (
          <div>
            <h2 className='text-2xl font-bold'>Welcome guest!</h2>
            <Link href='/auth'>Login</Link>
          </div>
        )}
      </main>
    </div>
  );
}
