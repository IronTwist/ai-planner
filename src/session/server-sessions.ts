import { cookies } from 'next/dist/server/request/cookies';

export const setCookies = async (data: { userId: string; token: string }) => {
  const cookieStore = await cookies();
  cookieStore.set(
    'ai-planner-session',
    new URLSearchParams(data).toString().replace(/\+/g, '%20'),
    {
      maxAge: 60 * 60 * 24 * 30, // 30 days
      sameSite: 'strict',
      path: '/',
    },
  );
};

export const getCookie = async (key: string) => {
  const cookieStore = await cookies();

  return cookieStore.get(key);
};

export const storeUserInfo = async (userId: string, token: string) => {
  setCookies({ userId, token });
};

export const getUserInfo = async () => {
  const session = await getCookie('ai-planner-session');

  if (!session) {
    return null;
  }

  return JSON.parse(session.value);
};

export const clearUserInfo = () => {
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
      // @ts-expect-error never will be assignable to string
      cache[key] = value;
      // console.log('cached: ', cache);
    }
  }
};
