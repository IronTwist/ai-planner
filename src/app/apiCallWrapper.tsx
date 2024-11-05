'use client';

import firebase from '@/service/client/firebase';
import { getCookie } from '@/session/client-session';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logIn, setUser } from '@/store/reducers/auth-slice';
import { AppDispatch } from '@/store/store';

export const ApiCallWrapper = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const userStore = useAppSelector(state => state.auth.user);
  const dispatch = useAppDispatch<AppDispatch>();

  console.log('User store: ', userStore);

  if (!userStore?.uid) {
    // Get data from cookie
    const cookie = getCookie('ai-planner-session');

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
            newAccount: false,
            token,
            metadata,
          },
        }),
      );
    } else {
      // No cookie
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

          //   router.push('/auth');
        }
      });
    }
    console.log('Cookie: ', cookie);
  } else {
    // already have user in store
  }

  return <>{children}</>;
};
