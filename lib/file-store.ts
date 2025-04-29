import fs from "fs"
import path from "path"

// Path to our data file
const DATA_FILE_PATH = path.join(process.cwd(), "public", "data", "meetings.json")

// Ensure the data directory exists
const ensureDataDir = () => {
  const dataDir = path.join(process.cwd(), "public", "data")
  const filesDir = path.join(process.cwd(), "public", "files")

  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }

  if (!fs.existsSync(filesDir)) {
    fs.mkdirSync(filesDir, { recursive: true })
  }

  if (!fs.existsSync(DATA_FILE_PATH)) {
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify([]))
  }
}

// Types
export type FileData = {
  id: string
  name: string
  type: string
  url: string
}

export type Meeting = {
  id: string
  date: string
  title: string
  files: FileData[]
}

// Get all meetings
export const getMeetings = (): Meeting[] => {
  ensureDataDir()

  try {
    const data = fs.readFileSync(DATA_FILE_PATH, "utf8")
    return JSON.parse(data)
  } catch (error) {
    console.error("Error reading meetings data:", error)
    return []
  }
}

// Add a file to a meeting
export const addFileToMeeting = (
  meetingTitle: string,
  meetingDate: string,
  fileData: Omit<FileData, "id">,
): FileData => {
  ensureDataDir()

  const meetings = getMeetings()
  const fileId = Date.now().toString()
  const newFile = { ...fileData, id: fileId }

  // Find if meeting already exists
  let meeting = meetings.find((m) => m.title === meetingTitle && m.date === meetingDate)

  if (meeting) {
    // Add file to existing meeting
    meeting.files.push(newFile)
  } else {
    // Create new meeting with this file
    const meetingId = Date.now().toString()
    meeting = {
      id: meetingId,
      title: meetingTitle,
      date: meetingDate,
      files: [newFile],
    }
    meetings.push(meeting)
  }

  // Save updated meetings
  fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(meetings, null, 2))

  return newFile
}

// Delete a file
export const deleteFile = (meetingId: string, fileId: string): boolean => {
  ensureDataDir()

  const meetings = getMeetings()
  const meetingIndex = meetings.findIndex((m) => m.id === meetingId)

  if (meetingIndex === -1) return false

  const meeting = meetings[meetingIndex]
  const fileIndex = meeting.files.findIndex((f) => f.id === fileId)

  if (fileIndex === -1) return false

  // Remove file from meeting
  meeting.files.splice(fileIndex, 1)

  // If meeting has no more files, remove the meeting too
  if (meeting.files.length === 0) {
    meetings.splice(meetingIndex, 1)
  }

  // Save updated meetings
  fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(meetings, null, 2))

  return true
}
