import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken");

  // /jobs ile başlayan tüm URL'leri kontrol et
  if (request.nextUrl.pathname.startsWith("/jobs")) {
    console.log(token);

    if (!token) {
      // Token yoksa ana sayfaya yönlendir
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

// Middleware'in hangi path'lerde çalışacağını belirt
export const config = {
  matcher: "/jobs/:path*",
};
