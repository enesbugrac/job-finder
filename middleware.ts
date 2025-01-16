import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["tr", "en"];
const defaultLocale = "tr";

function getLocale(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const pathnameLocale = locales.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameLocale) {
    console.log("PATHNAME LOCALE", pathnameLocale);

    return pathnameLocale;
  }

  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
  if (cookieLocale && locales.includes(cookieLocale)) {
    console.log("COOKIE LOCALE", cookieLocale);

    return cookieLocale;
  }

  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken");
  const pathname = request.nextUrl.pathname;
  const locale = getLocale(request);

  const response = NextResponse.next();
  response.cookies.set("NEXT_LOCALE", locale, { path: "/" });
  console.log("LOCALE", locale);

  if (pathname === "/" || !locales.some((loc) => pathname.startsWith(`/${loc}`))) {
    console.log("REDIRECT");

    return NextResponse.redirect(
      new URL(`/${locale}${pathname === "/" ? "" : pathname}`, request.url)
    );
  }

  if (pathname.includes("/jobs") && !token) {
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }
  console.log("OKEY", pathname);

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|flags|.*\\..*).*)"],
};
