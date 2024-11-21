import { NextRequest, NextResponse } from 'next/server';
import { getUserInfo } from './session/server-sessions';

export const protectedRoutes = ['/', '/dashboard', '/profile', '/notes'];

export default async function middlewares(req: NextRequest) {
  let isLogedIn = false;

  const route = req.nextUrl.origin;

  const userData = await getUserInfo();

  console.log('\x1b[32m%s\x1b[0m', 'Middleware: ', userData?.email);

  if (userData?.uid && userData?.token) {
    // TODO: use cookies to save data in cache for server side if needed
    // setCache('userName', userData?.userName);
    // setCache('email', userData?.email);

    isLogedIn = true;
  }

  const currentRoute = req.nextUrl.pathname;

  const publicRoutes = ['/auth/login', '/auth/sign-up'];

  // check for a route like /notes/HWRTGe1w....
  const isProtectedRoute = currentRoute.startsWith(protectedRoutes[3]);

  console.log('\x1b[33m%s\x1b[0m', 'Current route: ', currentRoute);

  if (isProtectedRoute && !isLogedIn) {
    return NextResponse.redirect(new URL('/auth/login', route));
  }

  if (
    !isLogedIn &&
    protectedRoutes.includes(req.nextUrl.pathname) &&
    !publicRoutes.includes(req.nextUrl.pathname)
  ) {
    console.log('req.nextUrl.pathname', req.nextUrl.pathname);
    return NextResponse.redirect(new URL('/auth/login', route));
  }
}
