import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { deleteFile } from "@/lib/file-store"

export async function DELETE(request: NextRequest, { params }: { params: { fileId: string } }) {
  // Check authentication
  const authCookie = cookies().get("auth")

  if (!authCookie) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
  }

  try {
    const { role } = JSON.parse(authCookie.value)

    if (role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    const { fileId } = params
    const meetingId = request.nextUrl.searchParams.get("meetingId")

    if (!meetingId) {
      return NextResponse.json({ success: false, message: "Missing meetingId parameter" }, { status: 400 })
    }

    const success = deleteFile(meetingId, fileId)

    if (!success) {
      return NextResponse.json({ success: false, message: "File not found" }, { status: 404 })
    }

    // Note: In a production app, you would also delete the physical file here

    return NextResponse.json({
      success: true,
      message: "File deleted successfully",
    })
  } catch (error) {
    console.error("Delete error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
