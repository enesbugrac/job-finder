import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["tr", "en"];
const defaultLocale = "tr";

function getLocale(request: NextRequest): string {
  const pathname = request.nextUrl.pathname;
  const pathnameLocale = locales.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  if (pathnameLocale) return pathnameLocale;

  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
  if (cookieLocale && locales.includes(cookieLocale)) return cookieLocale;

  const acceptLanguage = request.headers.get("accept-language");
  if (acceptLanguage) {
    const browserLocale = acceptLanguage.split(",")[0].split("-")[0];
    if (locales.includes(browserLocale)) return browserLocale;
  }

  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const locale = getLocale(request);

  if (!pathname.startsWith(`/${locale}`)) {
    const url = new URL(request.url);
    url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url);
  }

  if (pathname.includes("/jobs") && !request.cookies.get("accessToken")) {
    const url = new URL(request.url);
    url.pathname = `/${locale}`;
    return NextResponse.redirect(url);
  }

  const response = NextResponse.next();
  response.cookies.set("NEXT_LOCALE", locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|flags|.*\\..*).*)"],
};
