import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["tr", "en"];
const defaultLocale = "tr";

function getLocale(request: NextRequest) {
  const localeCookie = request.cookies.get("NEXT_LOCALE");
  console.log("localcookie", localeCookie);

  if (localeCookie?.value && locales.includes(localeCookie.value)) {
    return localeCookie.value;
  }

  const pathname = request.nextUrl.pathname;

  const pathnameLocale = locales.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  if (pathnameLocale) {
    console.log("pathnameLocale", pathnameLocale);

    return pathnameLocale;
  }

  console.log("defaultLocale", defaultLocale);

  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const locale = getLocale(request);
  const pathname = request.nextUrl.pathname;

  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    const url = new URL(`/${locale}${pathname}`, request.url);
    return NextResponse.redirect(url);
  }

  const response = NextResponse.next();

  if (
    !request.cookies.has("NEXT_LOCALE") ||
    request.cookies.get("NEXT_LOCALE")?.value !== locale
  ) {
    response.cookies.set("NEXT_LOCALE", locale);
  }
  console.log("locale", locale);

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|flags|.*\\..*).*)"],
};
