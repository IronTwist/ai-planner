import { NextRequest, NextResponse } from 'next/server';
import { getUserInfo, setCache } from './session/server-sessions';

export default async function middlewares(req: NextRequest) {
  let isLogedIn = false;

  const route = req.nextUrl.origin;

  const userData = await getUserInfo();

  if (userData?.uid && userData?.token) {
    // TODO: use cookies to save data in cache for server side
    setCache('userName', userData?.userName);
    setCache('email', userData?.email);

    isLogedIn = true;
  }

  const protectedRoutes = ['/dashboard', '/profile', '/', 'api/serve'];

  if (!isLogedIn && protectedRoutes.includes(req.nextUrl.pathname)) {
    console.log('req.nextUrl.pathname', req.nextUrl.pathname);
    return NextResponse.redirect(new URL('/auth', route));
  }
}
