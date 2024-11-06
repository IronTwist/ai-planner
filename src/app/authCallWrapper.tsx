'use client';

import firebase from '@/service/client/firebase';
import { getCookie } from '@/session/client-session';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setUser } from '@/store/reducers/auth-slice';
import { AppDispatch } from '@/store/store';
import { useEffect } from 'react';

export const ApiCallWrapper = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const userStore = useAppSelector(state => state.auth.user);
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
      } else {
        // No session
        firebase.auth().onAuthStateChanged(userResp => {
          if (userResp) {
            // User is signed in
            console.log('User is signed in: ', userResp, userStore);

            // dispatch(
            //   setUser({
            //     user: {
            //       uid: userResp.uid,
            //       email: userStore.email,
            //       userName: userStore.email.split('@')[0],
            //       refreshToken: userResp.refreshToken,
            //       newAccount: userStore.newAccount,
            //     },
            //   }),
            // );
          } else {
            console.log(
              'User is signed out: ',
              userResp,
              'userStore: ',
              userStore,
            );
          }
        });
      }
      console.log('Cookie: ', cookie);
    } else {
      // already have user in store
    }
  }, [dispatch, userStore]);

  return <>{children}</>;
};
