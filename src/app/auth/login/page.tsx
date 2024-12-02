'use client';

import { useEffect } from 'react';
import { useAppSelector } from '@/store/hooks';
import { LogInModal } from '@/modules/common/modal/logInModal';
import { useRouter } from 'next/navigation';
import { CircularProgress } from '@mui/material';

export type UserMetadataType = { createdAt: string; lastLoginAt: string };

export default function Login() {
  const router = useRouter();
  const loadindUser = useAppSelector(state => state.auth.loading);
  const user = useAppSelector(state => state.auth.user);

  useEffect(() => {
    if (user?.uid) {
      router.push(`${window.location.origin}/`);
    }
  }, [user, router]);

  return (
    <div className='flex justify-center items-center pt-16 p-8'>
      {loadindUser ? <CircularProgress /> : <LogInModal />}
    </div>
  );
}
