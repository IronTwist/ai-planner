'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Input } from '@/modules/common/input';
import { Button } from '@/modules/common/button';
import { AppDispatch } from '@/store/store';
import {
  logIn,
  logOut,
  authError,
  loading as loadingSlice,
} from '@/store/reducers/auth-slice';
import { useAppSelector } from '@/store/hooks';
import Link from 'next/link';
import firebase from '@/service/client/firebase';
import { useRouter } from 'next/navigation';
import { setCookie } from '@/session/client-session';
import { firestore } from '@/service/client/firebase';
import { addDoc, collection, doc, setDoc, deleteDoc } from 'firebase/firestore';

export default function Login() {
  const router = useRouter();
  const user = useAppSelector(state => state.auth.user);
  const loading = useAppSelector(state => state.auth.loading);
  const dispatch = useDispatch<AppDispatch>();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setPassword(e.target.value);
  };

  const handleLogin = async () => {
    dispatch(loadingSlice(true));

    await firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(async data => {
        console.log('Welcome', data);
        const userData = {
          uid: data.user?.uid || '',
          userName: data.user?.email?.split('@')[0] || '',
          email: data.user?.email || '',
          refreshToken: data.user?.refreshToken || '',
          newAccount: false,
        };

        const token = await data.user?.getIdToken(false);
        const metadata = data.user?.metadata;

        const dataForSession = {
          ...userData,
          token,
          metadata,
        };

        console.log('Data for session: ----->', dataForSession);

        try {
          // const docRef = await addDoc(collection(firestoreDatabase, 'users'), {
          //   email: dataForSession.email,
          //   name: dataForSession.userName,
          //   uid: dataForSession.uid,
          // });

          const usersCollection = collection(firestore, `users`);

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

          console.log('Document written with ID: ');
        } catch (e) {
          console.error('Error adding document: ', e);
        }

        if (token) {
          // storeUserInfo(dataForSession.uid, token);
          setCookie('ai-planner-session', JSON.stringify(dataForSession), 1);
        }

        console.log('dataForSession', dataForSession);

        dispatch(
          logIn({
            user: userData,
          }),
        );

        router.push('/');
      })
      .catch(error => {
        if (error.message === 'NEXT_REDIRECT') {
          console.log('Redirecting');
          router.push('/');
        }

        dispatch(authError({ message: error.message }));
        router.push('/');
      });
  };

  console.log('Current state: ', user);

  const handleLogout = () => {
    dispatch(logOut());
  };

  return (
    <div className='flex justify-center items-center p-8'>
      <div className='flex flex-col gap-4 justify-center items-center bg-cyan-900 w-64 p-4 h-auto'>
        {user ? <Button name='Logout' onClick={handleLogout} /> : null}
        <div>Email</div>
        <div>
          <Input value={email} onChange={handleEmailChange} />
        </div>
        <div>Password</div>
        <div>
          <Input value={password} onChange={handlePasswordChange} />
        </div>
        <Button name='Login' loading={loading} onClick={handleLogin} />
        <Link href='/' className='text-white'>
          Home
        </Link>
      </div>
    </div>
  );
}
