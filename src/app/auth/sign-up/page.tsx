'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Input } from '@/modules/common/input';
import { Button } from '@/modules/common/button';
import { AppDispatch } from '@/store/store';
import {
  authError,
  loading as loadingSlice,
  signUp,
} from '@/store/reducers/auth-slice';
import { useAppSelector } from '@/store/hooks';
import Link from 'next/link';
import firebase from '../../../service/client/firebase';
import { useRouter } from 'next/navigation';

export type UserSignUpResponse = {
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

export default function Login() {
  const error = useAppSelector(state => state.auth.error);
  const loading = useAppSelector(state => state.auth.loading);
  const dispatch = useDispatch<AppDispatch>();

  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setPassword(e.target.value);
  };
  const handlePasswordRepeatChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    e.preventDefault();
    setPasswordRepeat(e.target.value);
  };

  const handleSignUp = async () => {
    dispatch(loadingSlice(true));

    await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(async data => {
        console.log('Welcome', data);

        const token = await data.user?.getIdToken(false);
        const metadata = data.user?.metadata;

        const userData: UserSignUpResponse = {
          uid: data.user?.uid || '',
          userName: data.user?.email?.split('@')[0] || '',
          email: data.user?.email || '',
          refreshToken: data.user?.refreshToken || '',
          newAccount: true,
          token: token as string,
          metadata: metadata as any,
        };

        dispatch(
          signUp({
            user: userData,
          }),
        );

        router.push('/');
      })
      .catch(error => {
        if (error === 'NEXT_REDIRECT') {
          console.log('Redirecting');
          router.push('/');
        }

        dispatch(authError(error));
      });
  };

  return (
    <div className='flex justify-center items-center p-8'>
      <div className='flex flex-col gap-4 justify-center items-center bg-cyan-900 w-64 p-4 h-auto'>
        <h1>Sign Up</h1>
        <div>Email</div>
        <div>
          <Input value={email} onChange={handleEmailChange} />
        </div>
        <div>Password</div>
        <div>
          <Input value={password} onChange={handlePasswordChange} />
        </div>
        <div>Re-enter Password</div>
        <div>
          <Input value={passwordRepeat} onChange={handlePasswordRepeatChange} />
        </div>
        {error ? <div className='text-red-600'>{error}</div> : null}
        <Button name='Sign Up' loading={loading} onClick={handleSignUp} />
        <Link href='/' className='text-white'>
          Home
        </Link>
      </div>
    </div>
  );
}
