'use client';

import {
  loading as loadingSlice,
  authError,
  signUp,
} from '@/store/reducers/auth-slice';
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  FormLabel,
  Link,
  Stack,
  styled,
  SvgIcon,
  TextField,
  Typography,
} from '@mui/material';
import MuiCard from '@mui/material/Card';
import { useState } from 'react';
import firebase from '@/service/client/firebase';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { AppDispatch } from '@/store/store';
import { useRouter } from 'next/navigation';
import { setCookie } from '@/session/client-session';
import { UserMetadataType } from '@/app/auth/login/page';

export function GoogleIcon() {
  return (
    <SvgIcon>
      <svg
        width='16'
        height='16'
        viewBox='0 0 16 16'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M15.68 8.18182C15.68 7.61455 15.6291 7.06909 15.5345 6.54545H8V9.64364H12.3055C12.1164 10.64 11.5491 11.4836 10.6982 12.0509V14.0655H13.2945C14.8073 12.6691 15.68 10.6182 15.68 8.18182Z'
          fill='#4285F4'
        />
        <path
          d='M8 16C10.16 16 11.9709 15.2873 13.2945 14.0655L10.6982 12.0509C9.98545 12.5309 9.07636 12.8218 8 12.8218C5.92 12.8218 4.15273 11.4182 3.52 9.52727H0.858182V11.5927C2.17455 14.2036 4.87273 16 8 16Z'
          fill='#34A853'
        />
        <path
          d='M3.52 9.52C3.36 9.04 3.26545 8.53091 3.26545 8C3.26545 7.46909 3.36 6.96 3.52 6.48V4.41455H0.858182C0.312727 5.49091 0 6.70545 0 8C0 9.29455 0.312727 10.5091 0.858182 11.5855L2.93091 9.97091L3.52 9.52Z'
          fill='#FBBC05'
        />
        <path
          d='M8 3.18545C9.17818 3.18545 10.2255 3.59273 11.0618 4.37818L13.3527 2.08727C11.9636 0.792727 10.16 0 8 0C4.87273 0 2.17455 1.79636 0.858182 4.41455L3.52 6.48C4.15273 4.58909 5.92 3.18545 8 3.18545Z'
          fill='#EA4335'
        />
      </svg>
    </SvgIcon>
  );
}

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: {
    width: '450px',
  },
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(0),
  //   [theme.breakpoints.up('sm')]: {
  //     padding: theme.spacing(4),
  //   },
  //   '&::before': {
  //     content: '""',
  //     display: 'block',
  //     position: 'absolute',
  //     zIndex: -1,
  //     inset: 0,
  //     backgroundImage:
  //       'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
  //     backgroundRepeat: 'no-repeat',
  //     ...theme.applyStyles('dark', {
  //       backgroundImage:
  //         'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
  //     }),
  //   },
}));

export const SignUpModal = () => {
  const dispatch = useAppDispatch<AppDispatch>();
  const router = useRouter();
  const loading = useAppSelector(state => state.auth.loading);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');

  const validateInputs = () => {
    const email = document.getElementById('email') as HTMLInputElement;
    const password = document.getElementById('password') as HTMLInputElement;
    const confirmPassword = document.getElementById(
      'confirmPassword',
    ) as HTMLInputElement;

    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 6 characters long.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    if (!confirmPassword.value || confirmPassword.value !== password.value) {
      setPasswordError(true);
      setPasswordErrorMessage('Passwords do not match.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    return isValid;
  };

  const handleSubmit = () => {
    const validInputs = validateInputs();

    if (!validInputs) {
      return;
    }

    dispatch(loadingSlice(true));

    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(async data => {
        const token = await data.user?.getIdToken(false);
        const { createdAt, lastLoginAt } = data.user
          ?.metadata as UserMetadataType;

        if (token) {
          const userData = {
            uid: data.user?.uid || '',
            userName: data.user?.email?.split('@')[0] || '',
            email: data.user?.email || '',
            refreshToken: data.user?.refreshToken || '',
            newAccount: false,
            token,
            metadata: {
              createdAt: createdAt || '',
              lastLoginAt: lastLoginAt || '',
            },
          };

          setCookie('ai-planner-session', JSON.stringify(userData), 1);

          dispatch(
            signUp({
              user: userData,
            }),
          );

          router.push('/');
        }
      })
      .catch(error => {
        console.log('error', error);
        if (error.message === 'NEXT_REDIRECT') {
          router.push('/');
        }

        dispatch(authError({ message: error.message }));
        router.push('/');
      });
  };

  return (
    <SignUpContainer direction='column' justifyContent='space-between'>
      <Card variant='outlined'>
        <Typography
          component='h1'
          variant='h4'
          sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
        >
          Sign up
        </Typography>
        <Box
          component='form'
          onSubmit={handleSubmit}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <FormControl>
            <FormLabel htmlFor='email'>Email</FormLabel>
            <TextField
              required
              fullWidth
              id='email'
              placeholder='your@email.com'
              name='email'
              autoComplete='email'
              variant='outlined'
              error={emailError}
              helperText={emailErrorMessage}
              color={passwordError ? 'error' : 'primary'}
              onChange={e => setEmail(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor='password'>Password</FormLabel>
            <TextField
              required
              fullWidth
              name='password'
              placeholder='••••••'
              type='password'
              id='password'
              autoComplete='new-password'
              variant='outlined'
              error={passwordError}
              helperText={passwordErrorMessage}
              color={passwordError ? 'error' : 'primary'}
              onChange={e => setPassword(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor='password'>Repeat password</FormLabel>
            <TextField
              required
              fullWidth
              name='confirmPassword'
              placeholder='••••••'
              type='password'
              id='confirmPassword'
              autoComplete='new-password'
              variant='outlined'
              error={passwordError}
              helperText={passwordErrorMessage}
              color={passwordError ? 'error' : 'primary'}
            />
          </FormControl>
          <Button
            type='button'
            fullWidth
            variant='contained'
            onClick={handleSubmit}
          >
            {loading && (
              <CircularProgress
                sx={{ marginRight: 2 }}
                size={16}
                className=' flex text-white w-3 h-3'
              />
            )}
            Sign up
          </Button>
          <Typography sx={{ textAlign: 'center' }}>
            Already have an account?{' '}
            <span>
              <Link
                href='/auth/login'
                variant='body2'
                sx={{ alignSelf: 'center' }}
              >
                Sign in
              </Link>
            </span>
          </Typography>
        </Box>
        <Divider>
          <Typography sx={{ color: 'text.secondary' }}>or</Typography>
        </Divider>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button
            fullWidth
            variant='outlined'
            onClick={() => alert('Sign up with Google')}
            startIcon={<GoogleIcon />}
          >
            Sign up with Google
          </Button>
        </Box>
      </Card>
    </SignUpContainer>
  );
};
