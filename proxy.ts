import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { parse } from 'cookie';
import { checkServerSession } from './lib/api/serverApi';

const privateRoutes = ['/profile', '/notes'];
const publicRoutes = ['/sign-in', '/sign-up'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route),
  );
  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (accessToken) {
    if (isPublicRoute) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    // private or unknown route → allow
    return NextResponse.next();
  }

  if (!accessToken && refreshToken) {
    try {
      const data = await checkServerSession();
      const setCookieHeader = data.headers['set-cookie'];

      if (setCookieHeader) {
        const cookiesArray = Array.isArray(setCookieHeader)
          ? setCookieHeader
          : [setCookieHeader];

        for (const cookieStr of cookiesArray) {
          const parsed = parse(cookieStr);

          const options: {
            expires?: Date;
            path?: string;
            maxAge?: number;
          } = {};

          if (parsed.Expires) {
            options.expires = new Date(parsed.Expires);
          }

          if (parsed.Path) {
            options.path = parsed.Path;
          }

          if (parsed['Max-Age']) {
            const maxAge = Number(parsed['Max-Age']);
            if (!Number.isNaN(maxAge)) {
              options.maxAge = maxAge;
            }
          }

          if (parsed.accessToken) {
            cookieStore.set('accessToken', parsed.accessToken, options);
          }

          if (parsed.refreshToken) {
            cookieStore.set('refreshToken', parsed.refreshToken, options);
          }
        }

        if (isPublicRoute) {
          return NextResponse.redirect(new URL('/', request.url));
        }

        if (isPrivateRoute) {
          return NextResponse.next();
        }
      }
    } catch {}
  }

  if (!accessToken && !refreshToken) {
    if (isPrivateRoute) {
      return NextResponse.redirect('/sign-in');
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};
