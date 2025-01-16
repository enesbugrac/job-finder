import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["tr", "en"];
const defaultLocale = "tr";

function getLocale(request: NextRequest) {
  const localeCookie = request.cookies.get("SELECTED_LANGUAGE");
  if (localeCookie?.value && locales.includes(localeCookie.value)) {
    return localeCookie.value;
  }

  const pathname = request.nextUrl.pathname;
  const pathnameLocale = locales.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameLocale) {
    return pathnameLocale;
  }

  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const locale = getLocale(request);

  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|flags|.*\\..*).*)"],
};
