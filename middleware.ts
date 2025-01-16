import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["tr", "en"];
const defaultLocale = "tr";

function getLocale(request: NextRequest) {
  const localeCookie = request.cookies.get("SELECTED_LANGUAGE");
  if (localeCookie?.value && locales.includes(localeCookie.value)) {
    return localeCookie.value;
  }

  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const locale = getLocale(request);

  if (!pathname.startsWith(`/${locale}`)) {
    const newPath = pathname.replace(/^\/[^/]+/, "");
    return NextResponse.redirect(new URL(`/${locale}${newPath}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|flags|.*\\..*).*)"],
};
