'use client';

import { LogInModal } from '@/modules/common/modal/logInModal';
import { ModalWrapper } from '@/modules/common/modal/modalWrapper';
import { SignUpModal } from '@/modules/common/modal/signUpModal';
import { getCookie } from '@/session/client-session';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setUser } from '@/store/reducers/auth-slice';
import { AppDispatch } from '@/store/store';
import { useEffect } from 'react';

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

  const childrenContent = {
    signUpModal: <SignUpModal />,
    loginModal: <LogInModal />,
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
