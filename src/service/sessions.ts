import { stringify } from 'querystring';

import { cookies } from 'next/headers';

export const setCookies = async (data: { userId: string; token: string }) => {
  const cookieStore = await cookies();
  cookieStore.set('ai-planner-session', stringify(data), {
    maxAge: 60 * 60 * 24 * 30, // 30 days
    sameSite: 'strict',
    path: '/',
  });
};

export const getCookie = async (key: string) => {
  const cookieStore = await cookies();

  return cookieStore.get(key);
};

export const storeUserInfo = async (userId: string, token: string) => {
  localStorage.setItem('ai-planner-session', stringify({ userId, token }));
  setCookies({ userId, token });
};

export const getUserInfo = async () => {
  const session = await getCookie('ai-planner-session');

  if (!session) {
    return null;
  }

  return JSON.parse(session.value);
};

export const isLoggedIn = () => localStorage.getItem('userId') !== null;

export const clearUserInfo = () => {
  localStorage.removeItem('ai-planner-session');
  setCookies({ userId: '', token: '' });
};

type CacheType = {
  uid: string;
  userName: string;
  email: string;
  refreshToken: string;
  newAccount: boolean;
  token: string;
  metadata: {
    createdAt: string;
    lastLoginAt: string;
  };
};

export const cache: CacheType = {
  uid: '',
  userName: '',
  email: '',
  refreshToken: '',
  newAccount: false,
  token: '',
  metadata: {
    createdAt: '',
    lastLoginAt: '',
  },
};
type CacheKeys = keyof typeof cache;

export const setCache = (key: CacheKeys, value: string) => {
  if (!key || !value) {
    console.error('Invalid key or value provided');
    return;
  }

  if (key in cache) {
    if (cache.hasOwnProperty(key)) {
      // @ts-ignore
      cache[key] = value;
      console.log('cache: ', cache);
    }
  }
};
