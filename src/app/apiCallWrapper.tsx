'use client';
import firebase from '@/service/client/firebase';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logIn, setUser } from '@/store/reducers/auth-slice';
import { AppDispatch } from '@/store/store';
import { useRouter } from 'next/navigation';

export const ApiCallWrapper = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  //   fetch('/api/serve', {
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //   })
  //     .then(response => response.json())
  //     .then(data => {
  //       console.log('fetch data', data);
  //     });

  const router = useRouter();
  const userStore = useAppSelector(state => state.auth.user);
  const dispatch = useAppDispatch<AppDispatch>();

  firebase.auth().onAuthStateChanged(userResp => {
    console.log('userResp: ', userResp, 'userStore: ', userStore);
    if (userResp) {
      console.log('User is signed in: ', userResp, userStore);
      if (userStore?.email) {
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
      }
    } else {
      console.log('User is signed out: ', userResp, 'userStore: ', userStore);

      //   router.push('/auth');
    }
  });

  return <>{children}</>;
};
