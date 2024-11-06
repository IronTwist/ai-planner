'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logOut } from '@/store/reducers/auth-slice';
import { AppDispatch } from '@/store/store';
import Link from 'next/link';
import firebase from '@/service/client/firebase';
import { deleteCookie } from '@/session/client-session';
import { useRouter } from 'next/navigation';
import Navigation from '@/modules/UI/navigation/navigation';

export default function Home() {
  const user = useAppSelector(state => state.auth.user);
  const loading = useAppSelector(state => state.auth.loading);
  const dispatch = useAppDispatch<AppDispatch>();
  const router = useRouter();

  return (
    <div className='flex flex-col p-1 mt-24'>
      <Navigation />
      <main className='flex flex-col gap-8 row-start-2 items-center sm:items-start p-4'>
        <h1 className='text-4xl font-bold'>Ai Planner</h1>
        <h3>Username: {!loading && user?.userName}</h3>
        {user ? (
          <div>
            <h2 className='text-2xl font-bold'>Welcome {user.userName}!</h2>
            <Link
              href='/'
              onClick={async () => {
                dispatch(logOut());
                router.push('/');
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
