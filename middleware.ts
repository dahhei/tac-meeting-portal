import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get("auth")
  const path = request.nextUrl.pathname

  // If no auth cookie and not on the login page, redirect to login
  if (!authCookie && path !== "/") {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // If auth cookie exists, check role-based access
  if (authCookie) {
    try {
      const { role } = JSON.parse(authCookie.value)

      // Protect admin routes from non-admin users
      if (path.startsWith("/admin") && role !== "admin") {
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }

      // Redirect authenticated users from login page to appropriate dashboard
      if (path === "/") {
        if (role === "admin") {
          return NextResponse.redirect(new URL("/admin", request.url))
        } else {
          return NextResponse.redirect(new URL("/dashboard", request.url))
        }
      }
    } catch (error) {
      // Invalid cookie, clear it and redirect to login
      const response = NextResponse.redirect(new URL("/", request.url))
      response.cookies.delete("auth")
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
