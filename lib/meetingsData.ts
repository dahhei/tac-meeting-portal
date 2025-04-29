/**
 * Represents a single document associated with a meeting.
 */
export interface MeetingDocument {
  /** The display name for the document link (e.g., "Agenda", "Presentation Slides") */
  name: string;
  /** The web-accessible path to the PDF file (relative to the public directory root) */
  path: string;
}

/**
 * Represents a single meeting, containing its details and associated documents.
 */
export interface Meeting {
  /** A unique identifier for the meeting */
  id: string;
  /** The date of the meeting (e.g., "YYYY-MM-DD") */
  date: string;
  /** The title or main topic of the meeting */
  title: string;
  /** An array of documents related to this meeting */
  documents: MeetingDocument[];
}

/**
 * The main data source for all meetings to be displayed in the portal.
 *
 * TODO: Replace this example data with your actual meeting information and PDF paths.
 * Ensure the `path` correctly points to the files within your `public/meetings/` directory structure.
 * Example: If a file is at `public/meetings/2024-07-15_Budget/agenda.pdf`, the path should be "/meetings/2024-07-15_Budget/agenda.pdf"
 */
export const meetings: Meeting[] = [
  {
    id: "example-meeting-1",
    date: "2024-07-15",
    title: "Example Budget Review",
    documents: [
      { name: "Agenda", path: "/meetings/YYYY-MM-DD_Meeting_Topic/agenda.pdf" }, // <-- CHANGE PATH
      { name: "Presentation", path: "/meetings/YYYY-MM-DD_Meeting_Topic/presentation.pdf" }, // <-- CHANGE PATH
    ],
  },
  {
    id: "example-meeting-2",
    date: "2024-08-01",
    title: "Example Project Kickoff",
    documents: [
      { name: "Project Brief", path: "/meetings/YYYY-MM-DD_Another_Topic/brief.pdf" }, // <-- CHANGE PATH
    ],
  },
  // Add more meeting objects here following the same structure
]; 