'use client';

import { useEffect } from 'react';
import { useAppSelector } from '@/store/hooks';
import { useRouter } from 'next/navigation';
import { SignUpModal } from '@/modules/common/modal/signUpModal';

export type UserSignUpResponseType = {
  uid: string | null;
  userName: string | null;
  email: string | null;
  refreshToken: string | null;
  newAccount: boolean;
  token: string | null;
  metadata: {
    createdAt: string;
    lastLoginAt: string;
  };
} | null;

export type UserSignUpResponseTypeKeys = keyof UserSignUpResponseType;

export default function SignUp() {
  const router = useRouter();
  const user = useAppSelector(state => state.auth.user);

  useEffect(() => {
    if (user?.uid) {
      router.push('/');
    }
  }, [user, router]);

  return (
    <div className='flex justify-center items-center p-8'>
      <SignUpModal />
    </div>
  );
}
