'use client';

import { useEffect } from 'react';
import { useAppSelector } from '@/store/hooks';
import { LogInModal } from '@/modules/common/modal/logInModal';
import { useRouter } from 'next/navigation';

export type UserMetadataType = { createdAt: string; lastLoginAt: string };

export default function Login() {
  const router = useRouter();
  const user = useAppSelector(state => state.auth.user);

  useEffect(() => {
    if (user?.uid) {
      router.push('/');
    }
  }, [user, router]);

  return (
    <div className='flex justify-center items-center pt-16 p-8'>
      {/* <Navigation /> */}
      <LogInModal />
    </div>
  );
}
