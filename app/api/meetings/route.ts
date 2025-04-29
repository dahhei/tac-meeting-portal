import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getMeetings } from "@/lib/file-store"

export async function GET() {
  // Check authentication
  const authCookie = cookies().get("auth")

  if (!authCookie) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
  }

  try {
    // Get all meetings
    const meetings = getMeetings()

    return NextResponse.json({
      success: true,
      meetings,
    })
  } catch (error) {
    console.error("Error getting meetings:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
