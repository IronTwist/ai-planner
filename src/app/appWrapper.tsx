'use client';

import { AddNoteModal } from '@/modules/common/modal/addNoteModal';
import { LogInModal } from '@/modules/common/modal/logInModal';
import { ModalWrapper } from '@/modules/common/modal/modalWrapper';
import { SignUpModal } from '@/modules/common/modal/signUpModal';
import { getCookie, setCookie } from '@/session/client-session';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logOut, setUser } from '@/store/reducers/auth-slice';
import { AppDispatch } from '@/store/store';
import { useEffect } from 'react';
import { getAuth, getIdTokenResult, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { notesRepository } from './repositories/notes';
import { setNotes } from '@/store/reducers/notes-slice';
import { preloadImages } from '@/utils';
import { SnackbarProvider } from 'notistack';

const childrenContent = {
  signUpModal: <SignUpModal />,
  loginModal: <LogInModal />,
  addNoteModal: <AddNoteModal />,
};

export type ModalName = keyof typeof childrenContent;

export const AppWrapper = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const userStore = useAppSelector(state => state.auth.user);
  const modalStore = useAppSelector(state => state.modal);
  const dispatch = useAppDispatch<AppDispatch>();
  const router = useRouter();

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

  useEffect(() => {
    const auth = getAuth();

    onAuthStateChanged(auth, user => {
      if (user?.uid) {
        const checkTokenExpiration = async () => {
          const cookie = getCookie('ai-planner-session');
          // if (cookie) {
          //   const { uid, email, refreshToken, newAccount, token, metadata } =
          //     JSON.parse(cookie);
          //   const lastLoginTImestamp = parseInt(metadata.lastLoginAt);

          //   const lastLogin = new Date(lastLoginTImestamp);
          //   console.log('lastLogin', lastLogin);
          //   const expiresTime = new Date(
          //     lastLogin.getTime() + 1 * 60 * 60 * 1000,
          //   ); // 1 hour after last login

          //   console.log('expiresTime', expiresTime);
          //   const currentTime = new Date().getTime();
          //   const timeDifferenceMillis = Math.floor(
          //     expiresTime.getTime() - currentTime,
          //   );
          //   const timeInMinutes = timeDifferenceMillis / (1000 * 60);

          //   console.log('Cookie time check: ', timeInMinutes, '<', 5);
          //   return;

          //   // const currentTime = new Date().getTime();
          //   // const expiresTime = new Date(expiresIn).getTime();

          //   // const timeDifferenceMillis = Math.floor(expiresTime - currentTime);
          //   // const timeInMinutes = timeDifferenceMillis / (1000 * 60);

          //   // console.log('time check: ', timeInMinutes, '<', 5);
          // }

          const tokenResult = await getIdTokenResult(user);
          const expiresIn = tokenResult.expirationTime;

          const currentTime = new Date().getTime();
          const expiresTime = new Date(expiresIn).getTime();

          const timeDifferenceMillis = Math.floor(expiresTime - currentTime);
          const timeInMinutes = timeDifferenceMillis / (1000 * 60);

          console.log('time check: ', timeInMinutes, '<', 5);

          // If token is about to expire in the next 5 minutes, refresh it
          if (timeInMinutes < 5) {
            const newToken = await user.getIdToken(true);
            if (cookie) {
              const { uid, email, refreshToken, newAccount, metadata } =
                JSON.parse(cookie);

              // Update cookie with new token
              const userData = {
                uid: uid || '',
                userName: email?.split('@')[0] || '',
                email: email || '',
                refreshToken: refreshToken || '',
                newAccount,
                token: newToken,
                metadata: {
                  createdAt: metadata.createdAt || '',
                  lastLoginAt: metadata.lastLoginAt || '',
                },
              };

              setCookie('ai-planner-session', JSON.stringify(userData), 1);

              dispatch(
                setUser({
                  user: userData,
                }),
              );
            }
          }
        };

        // Check token expiration every 5 minutes
        const interval = setInterval(checkTokenExpiration, 5 * 60 * 1000);
        return () => clearInterval(interval);
      } else {
        // No user is signed in
        dispatch(logOut());
        // router.push(`${window.location.origin}/auth/login`);
      }
    });
  }, [dispatch, router, userStore]);

  useEffect(() => {
    if (userStore?.uid) {
      // initialize state
      notesRepository.getNotes(userStore).then(data => {
        dispatch(
          setNotes({ notes: data.data, loading: false, error: data.error }),
        );
      });
    }
  }, [dispatch, userStore]);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, user => {
      if (user) {
        // User is signed in, user object is returned
      } else {
        // No user is signed in
      }
    });

    preloadImages();
  }, []);

  return (
    <>
      <SnackbarProvider
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        autoHideDuration={2000}
      >
        <div>
          <ModalWrapper open={modalStore.isOpen}>
            {childrenContent[modalStore.name as ModalName]}
          </ModalWrapper>
        </div>
        {children}
      </SnackbarProvider>
    </>
  );
};
