"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { FileIcon, Trash2Icon, Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Meeting } from "@/lib/file-store"

type MeetingOriginal = {
  id: string
  date: string
  title: string
  files: {
    id: string
    name: string
    type: string
    url: string
  }[]
}

// Mock data - in a real app, this would come from your API
const MOCK_MEETINGS: MeetingOriginal[] = [
  {
    id: "1",
    date: "2023-06-15",
    title: "Summer TAC Meeting 2023",
    files: [
      { id: "1", name: "TAC Summary", type: "summary", url: "#" },
      { id: "2", name: "TAC Report", type: "report", url: "#" },
      { id: "3", name: "Presentation Slides", type: "slides", url: "#" },
    ],
  },
  {
    id: "2",
    date: "2023-12-10",
    title: "Winter TAC Meeting 2023",
    files: [
      { id: "4", name: "TAC Summary", type: "summary", url: "#" },
      { id: "5", name: "TAC Report", type: "report", url: "#" },
      { id: "6", name: "Signed Form", type: "signed", url: "#" },
      { id: "7", name: "Career Goals", type: "career", url: "#" },
    ],
  },
]

export function MeetingList({ viewOnly }: { viewOnly: boolean }) {
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const { toast } = useToast()

  // In a real app, fetch meetings from your API
  useEffect(() => {
    // Fetch meetings data from our API
    fetch("/api/meetings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setMeetings(data.meetings)
        }
      })
      .catch((error) => {
        console.error("Error fetching meetings:", error)
        // If there's an error, we'll just use the initial state
      })
  }, [])

  const handleDelete = async (meetingId: string, fileId: string) => {
    if (confirm("Are you sure you want to delete this file?")) {
      try {
        const response = await fetch(`/api/files/${fileId}?meetingId=${meetingId}`, {
          method: "DELETE",
        })

        const data = await response.json()

        if (data.success) {
          // Update local state
          setMeetings(
            meetings
              .map((meeting) => {
                if (meeting.id === meetingId) {
                  return {
                    ...meeting,
                    files: meeting.files.filter((file) => file.id !== fileId),
                  }
                }
                return meeting
              })
              .filter((meeting) => meeting.files.length > 0),
          )

          toast({
            title: "File deleted",
            description: "The file has been successfully deleted.",
          })
        } else {
          throw new Error(data.message || "Failed to delete file")
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete the file. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getFileIcon = (type: string) => {
    return <FileIcon className="h-4 w-4 mr-2" />
  }

  return (
    <div className="space-y-6">
      {meetings.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">No meetings found.</p>
          </CardContent>
        </Card>
      ) : (
        <Accordion type="single" collapsible className="w-full">
          {meetings.map((meeting) => (
            <AccordionItem key={meeting.id} value={meeting.id}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex flex-col items-start sm:flex-row sm:items-center">
                  <span className="font-medium">{meeting.title}</span>
                  <span className="text-sm text-muted-foreground sm:ml-4">{formatDate(meeting.date)}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pt-2">
                  {meeting.files.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No files available.</p>
                  ) : (
                    meeting.files.map((file) => (
                      <div key={file.id} className="flex items-center justify-between rounded-md border p-3">
                        <div className="flex items-center">
                          {getFileIcon(file.type)}
                          <span>{file.name}</span>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" asChild>
                            <a href={file.url} download>
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </a>
                          </Button>

                          {!viewOnly && (
                            <Button variant="outline" size="sm" onClick={() => handleDelete(meeting.id, file.id)}>
                              <Trash2Icon className="h-4 w-4 text-red-500" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  )
}
