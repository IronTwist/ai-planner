'use client';

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
      }
    }
  }, [dispatch, userStore]);

  return <>{children}</>;
};
