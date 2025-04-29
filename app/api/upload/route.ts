import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { writeFile } from "fs/promises"
import path from "path"
import { addFileToMeeting } from "@/lib/file-store"

export async function POST(request: NextRequest) {
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

    const formData = await request.formData()
    const file = formData.get("file") as File
    const meetingTitle = formData.get("meetingTitle") as string
    const meetingDate = formData.get("meetingDate") as string
    const fileType = formData.get("fileType") as string
    const customName = formData.get("customName") as string

    if (!file || !meetingTitle || !meetingDate || !fileType) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 })
    }

    // Create a safe filename
    const fileName = customName || file.name
    const safeFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_")

    // Save the file to the public/files directory
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const filePath = path.join(process.cwd(), "public", "files", safeFileName)
    await writeFile(filePath, buffer)

    // Add file metadata to our store
    const fileUrl = `/files/${encodeURIComponent(safeFileName)}`
    const newFile = addFileToMeeting(meetingTitle, meetingDate, {
      name: fileName,
      type: fileType,
      url: fileUrl,
    })

    return NextResponse.json({
      success: true,
      message: "File uploaded successfully",
      file: newFile,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
