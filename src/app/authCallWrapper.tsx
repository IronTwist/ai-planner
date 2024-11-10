'use client';

import { AddNoteModal } from '@/modules/common/modal/addNoteModal';
import { LogInModal } from '@/modules/common/modal/logInModal';
import { ModalWrapper } from '@/modules/common/modal/modalWrapper';
import { SignUpModal } from '@/modules/common/modal/signUpModal';
import { getCookie } from '@/session/client-session';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setUser } from '@/store/reducers/auth-slice';
import { AppDispatch } from '@/store/store';
import { useEffect } from 'react';
import { getAuth, getIdTokenResult, onAuthStateChanged } from 'firebase/auth';

export const AuthCallWrapper = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const userStore = useAppSelector(state => state.auth.user);
  const modalStore = useAppSelector(state => state.modal);
  const dispatch = useAppDispatch<AppDispatch>();

  useEffect(() => {
    const cookie = getCookie('ai-planner-session');

    if (!userStore?.uid) {
      if (cookie) {
        const { uid, email, refreshToken, newAccount, token, metadata } =
          JSON.parse(cookie);

        dispatch(
          setUser({
            user: {
              uid,
              userName: email.split('@')[0],
              email,
              refreshToken,
              newAccount,
              token,
              metadata,
            },
          }),
        );
      }
    }
  }, [dispatch, userStore]);

  // TODO fix refrresh token
  // useEffect(() => {
  //   const auth = getAuth();
  //   onAuthStateChanged(auth, user => {
  //     if (user) {
  //       // User check refresh token
  //       console.log('ser check refresh token:', user);
  //       const checkTokenExpiration = async () => {
  //         const tokenResult = await getIdTokenResult(user);
  //         console.log('token expiration time', tokenResult.expirationTime);
  //         const expiresIn = tokenResult.expirationTime - Date.now();

  //         // If token is about to expire in the next 5 minutes, refresh it
  //         if (expiresIn < 5 * 60 * 1000) {
  //           const newToken = await user.getIdToken(true);
  //           // setToken(newToken); // Update the token in AuthContext
  //           // updateUSer
  //         }
  //       };

  //       // Check token expiration every 5 minutes
  //       const interval = setInterval(checkTokenExpiration, 5 * 60 * 1000);
  //       return () => clearInterval(interval);
  //     } else {
  //       // No user is signed in
  //       console.log('User is signed out');
  //     }
  //   });
  // }, [userStore]);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, user => {
      if (user) {
        // User is signed in, user object is returned
        console.log('User is signed in:', user);
      } else {
        // No user is signed in
        console.log('User is signed out');
      }
    });
  }, []);

  const childrenContent = {
    signUpModal: <SignUpModal />,
    loginModal: <LogInModal />,
    addNoteModal: <AddNoteModal />,
  };

  type ModalName = keyof typeof childrenContent;

  return (
    <>
      <div>
        <ModalWrapper open={modalStore.isOpen}>
          {childrenContent[modalStore.name as ModalName]}
        </ModalWrapper>
      </div>
      {children}
    </>
  );
};
