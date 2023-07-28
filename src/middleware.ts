import { NextResponse } from "next/server";

const AUTH_PAGES = ["/user/login", "/register"];

const isAuthPages = (url: string) =>
  AUTH_PAGES.some((page) => page.startsWith(url));

function isTokenExpired(token: string) {
  const tokenData: object = JSON.parse(
    Buffer.from(token.split(".")[1], "base64").toString()
  );

  let result: boolean;

  // @ts-ignore
  if (tokenData.exp * 1000 < Date.now()) {
    result = true;
  } else {
    result = false;
  }
  return result;
}

const PUBLIC_FILE = /\.(.*)$/;

export async function middleware(request: any) {
  const { url, nextUrl } = request;

  if (nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL(`/expense`, url));
  }

  if (
    nextUrl.pathname.startsWith("/_next") || // exclude Next.js internals
    nextUrl.pathname.startsWith("/api") || //  exclude all API routes
    nextUrl.pathname.startsWith("/static") || // exclude static files
    PUBLIC_FILE.test(nextUrl.pathname) // exclude all files in the public folder
  )
    return NextResponse.next();

  const isAuthPageRequested = isAuthPages(nextUrl.pathname);

  const isAuthPageResponse = isAuthPages(url.pathname);

  const token = request.cookies.get("token")?.value;

  if (token && !isAuthPageRequested) {
    const isExpired: boolean = isTokenExpired(token);

    if (isExpired) {
      console.log("token expired");
      return NextResponse.redirect(new URL(`/user/login`, url));
    }
  }

  if (!token && !isAuthPageRequested) {
    return NextResponse.redirect(new URL(`/user/login`, url));
  }
}
