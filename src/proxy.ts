import createIntlMiddleware from 'next-intl/middleware';
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createIntlMiddleware(routing);

function getLocaleFromPath(pathname: string) {
  const match = pathname.match(/^\/(en|fr)(\/|$)/);
  return match?.[1] ?? routing.defaultLocale;
}

function isDashboardLoginPath(pathname: string) {
  return /\/dashboard\/login\/?$/.test(pathname);
}

function isDashboardPath(pathname: string) {
  return /\/dashboard(\/|$)/.test(pathname) && !isDashboardLoginPath(pathname);
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasLocalePrefix = /^\/(en|fr)(\/|$)/.test(pathname);

  if (!hasLocalePrefix) {
    return intlMiddleware(request);
  }

  if (isDashboardPath(pathname)) {
    let response = NextResponse.next({ request });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
            response = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      const locale = getLocaleFromPath(pathname);
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = `/${locale}/dashboard/login`;
      const redirectResponse = NextResponse.redirect(loginUrl);
      response.cookies.getAll().forEach((cookie) => {
        redirectResponse.cookies.set(cookie.name, cookie.value);
      });
      redirectResponse.headers.set('Cache-Control', 'private, no-store');
      return redirectResponse;
    }

    response.headers.set('Cache-Control', 'private, no-store');
    return response;
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
