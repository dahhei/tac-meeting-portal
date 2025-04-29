"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent } from "@/components/ui/card"
import { meetings } from "@/lib/meetingsData" // Import static data
import { FileTextIcon, Loader2Icon } from "lucide-react"
import { pdfjs, Document, Page } from 'react-pdf'
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
 * including a preview thumbnail of the first page of each PDF.
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

  const previewWidth = 150; // Set a width for the thumbnails

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
                <div className="space-y-4 pt-2"> {/* Increased spacing */}
                  {meeting.documents.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No documents available.</p>
                  ) : (
                    <ul className="space-y-4"> {/* Increased spacing */}
                      {meeting.documents.map((doc) => (
                        <li key={doc.path} className="flex flex-col sm:flex-row items-start rounded-md border p-4"> {/* Allow flex column layout on small screens */}
                          {/* Preview Section */}
                          <div className={`mb-3 sm:mb-0 sm:mr-4 flex-shrink-0 w-full sm:w-[${previewWidth}px] border rounded overflow-hidden bg-muted`}> {/* Added styling */}
                            <Document
                              file={doc.path}
                              loading={<div className="h-40 flex items-center justify-center text-muted-foreground"><Loader2Icon className="h-5 w-5 animate-spin mr-2"/>Loading preview...</div>}
                              error={<div className="h-40 flex items-center justify-center text-destructive-foreground bg-destructive p-2 text-center">Failed to load preview.<br/>Ensure PDF exists at path.</div>} // Improved error message
                              // options prop removed - relying on global worker config
                            >
                              {/* Render only the first page as a thumbnail */}
                              <Page
                                pageNumber={1}
                                width={previewWidth}
                                renderTextLayer={false} // Disable text layer for thumbnail
                                renderAnnotationLayer={false} // Disable annotation layer for thumbnail
                                // customTextRenderer prop removed
                              />
                            </Document>
                          </div>

                          {/* Info and Link Section */}
                          <div className="flex-grow flex flex-col justify-between h-full">
                             <div className="flex items-start mb-2">
                               <FileTextIcon className="h-4 w-4 mr-2 flex-shrink-0 mt-1" />
                               <span className="flex-grow break-words font-medium">{doc.name}</span>
                             </div>
                             <a
                               href={doc.path}
                               target="_blank" // Open in new tab
                               rel="noopener noreferrer"
                               className="mt-auto self-start sm:self-end px-3 py-1 text-sm border rounded-md hover:bg-accent whitespace-nowrap"
                             >
                               View Full PDF
                             </a>
                          </div>
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
