'use client';

import { RandomNumberChart } from '@/modules/UI/components/molecules/random-number-chart';
import { useAppSelector } from '@/store/hooks';
import Link from 'next/link';

export default function Home() {
  const user = useAppSelector(state => state.auth.user);

  return (
    <div className='flex flex-col p-1 mt-24'>
      <main className='flex flex-col gap-8 row-start-2 items-center sm:items-start p-4'>
        {/* <h1 className='text-4xl font-bold'>Ai Planner</h1>
        <h3>Username: {!loading && user?.userName}</h3>
        <Image
          src='./images/patternpad.svg'
          width={100}
          height={100}
          alt='user'
        /> */}
        {user ? (
          <div style={{ width: '100%' }} className='flex flex-col gap-4'>
            <h2 className='text-2xl font-bold'>
              Welcome {user.userName}! This project is a work in progress
            </h2>

            <div style={{ width: '100%' }}>
              <RandomNumberChart />
            </div>
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
