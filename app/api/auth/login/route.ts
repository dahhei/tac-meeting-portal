import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

// Use environment variables instead of hardcoded values
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin"
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123"
const USER_USERNAME = process.env.USER_USERNAME || "user"
const USER_PASSWORD = process.env.USER_PASSWORD || "user123"

export async function POST(request: NextRequest) {
  const { username, password } = await request.json()

  // Check admin credentials
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    // Set a secure HTTP-only cookie
    cookies().set({
      name: "auth",
      value: JSON.stringify({ role: "admin", username }),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    })

    return NextResponse.json({ success: true, role: "admin" })
  }

  // Check user credentials
  if (username === USER_USERNAME && password === USER_PASSWORD) {
    // Set a secure HTTP-only cookie
    cookies().set({
      name: "auth",
      value: JSON.stringify({ role: "user", username }),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    })

    return NextResponse.json({ success: true, role: "user" })
  }

  // Invalid credentials
  return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 })
}
