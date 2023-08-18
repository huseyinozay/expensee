import { NextResponse } from "next/server";
import { logoutUser } from "./redux/features/user";
import { store } from "./redux/store";
import { isAuthPages } from "./utils/utils";

function isTokenExpired(token: string) {
  const tokenData: any = JSON.parse(
    Buffer.from(token.split(".")[1], "base64").toString()
  );

  let result: boolean;

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

  if (token) {
    //const isExpired: boolean = isTokenExpired(token);
    // if (isExpired && !isAuthPageRequested) {
    //   store.dispatch(logoutUser());
    //   return NextResponse.redirect(new URL(`/login`, url));
    // }
    // if (isAuthPageRequested)
    //   return NextResponse.redirect(new URL(`/expense`, url));
  }

  if (!token && !isAuthPageRequested) {
    store.dispatch(logoutUser());
    return NextResponse.redirect(new URL(`/login`, url));
  }
}
