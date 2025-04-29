"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent } from "@/components/ui/card"
import { meetings } from "@/lib/meetingsData" // Import static data
import { FileTextIcon, Loader2Icon } from "lucide-react"
import { pdfjs, Document, Page } from 'react-pdf'
import { Button } from "@/components/ui/button" // Import Button
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'; // Required CSS
import 'react-pdf/dist/esm/Page/TextLayer.css';     // Required CSS (if rendering text layer, not strictly needed for thumbnail)

// Configure the worker source for pdf.js (required by react-pdf)
// Use the version from the CDN that matches the pdfjs-dist installed by react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

// --- Alternatively, using a CDN ---
// pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;


/**
 * Renders a list of meetings and their associated documents using static data,
 * including a preview thumbnail of the first page of each PDF, arranged side-by-side.
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

  const previewWidth = 250; // Increased thumbnail width

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
                <div className="flex flex-wrap gap-4 pt-2"> {/* Flexbox with gap */}
                  {meeting.documents.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No documents available.</p>
                  ) : (
                    meeting.documents.map((doc) => (
                      // Each document item
                      <div key={doc.path} className="flex flex-col items-center rounded-md border p-3 w-[${previewWidth + 20}px]"> {/* Fixed width container for item */}
                        {/* Preview Section */}
                        <div className={`mb-3 flex-shrink-0 w-[${previewWidth}px] h-auto border rounded overflow-hidden bg-muted`}> {/* Use specific width */}
                          <Document
                            file={doc.path}
                            loading={<div className={`h-[${previewWidth * 1.4}px] flex items-center justify-center text-muted-foreground`}><Loader2Icon className="h-5 w-5 animate-spin mr-2"/>Loading...</div>} // Adjusted height
                            error={<div className={`h-[${previewWidth * 1.4}px] flex items-center justify-center text-destructive-foreground bg-destructive p-2 text-center`}>Failed preview.</div>} // Adjusted height
                          >
                            <Page
                              pageNumber={1}
                              width={previewWidth}
                              renderTextLayer={false}
                              renderAnnotationLayer={false}
                            />
                          </Document>
                        </div>

                        {/* Info and Button Section Below Preview */}
                        <div className="flex flex-col items-center text-center w-full">
                          <div className="flex items-start mb-2">
                            <FileTextIcon className="h-4 w-4 mr-1 flex-shrink-0 mt-1" />
                            <span className="flex-grow break-words text-sm font-medium">{doc.name}</span>
                          </div>
                          {/* Button styled link */}
                          <Button variant="outline" size="sm" asChild className="mt-auto">
                            <a
                              href={doc.path}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View Full PDF
                            </a>
                          </Button>
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
