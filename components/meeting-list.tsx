"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent } from "@/components/ui/card"
import { meetings, Meeting } from "@/lib/meetingsData" // Import static data
import { FileTextIcon } from "lucide-react"

/**
 * Renders a list of meetings and their associated documents using static data.
 */
export function MeetingList() {
  const formatDate = (dateString: string) => {
    try {
      // Add time component to ensure consistent parsing across browsers
      return new Date(`${dateString}T00:00:00`).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (e) {
      console.error("Invalid date format:", dateString);
      return dateString; // Return original string if formatting fails
    }
  };

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
                <div className="flex flex-col items-start text-left sm:flex-row sm:items-center">
                  <span className="font-medium">{meeting.title}</span>
                  <span className="text-sm text-muted-foreground sm:ml-4">{formatDate(meeting.date)}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pt-2">
                  {meeting.documents.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No documents available.</p>
                  ) : (
                    <ul className="space-y-2">
                      {meeting.documents.map((doc) => (
                        <li key={doc.path} className="flex items-center justify-between rounded-md border p-3">
                          <div className="flex items-center">
                            <FileTextIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                            <span className="flex-grow break-words">{doc.name}</span>
                          </div>
                          <a
                            href={doc.path}
                            target="_blank" // Open in new tab
                            rel="noopener noreferrer"
                            className="ml-4 px-3 py-1 text-sm border rounded-md hover:bg-accent whitespace-nowrap"
                          >
                            View PDF
                          </a>
                        </li>
                      ))}
                    </ul>
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
