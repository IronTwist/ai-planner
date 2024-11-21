'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logOut } from '@/store/reducers/auth-slice';
import { AppDispatch } from '@/store/store';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Home() {
  const user = useAppSelector(state => state.auth.user);
  const loading = useAppSelector(state => state.auth.loading);
  const dispatch = useAppDispatch<AppDispatch>();
  const router = useRouter();

  return (
    <div className='flex flex-col p-1 mt-24'>
      <main className='flex flex-col gap-8 row-start-2 items-center sm:items-start p-4'>
        <h1 className='text-4xl font-bold'>Ai Planner</h1>
        <h3>Username: {!loading && user?.userName}</h3>
        <Image
          src='./images/patternpad.svg'
          width={100}
          height={100}
          alt='user'
        />
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
