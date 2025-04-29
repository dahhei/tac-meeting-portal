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
  /** A unique identifier for the meeting (derived from folder name) */
  id: string;
  /** The date of the meeting (derived from folder name) */
  date: string;
  /** The title or main topic of the meeting (derived from folder name) */
  title: string;
  /** An array of documents related to this meeting */
  documents: MeetingDocument[];
}

/**
 * Data source for meetings, generated from the contents of the public/meetings directory.
 */
export const meetings: Meeting[] = [
  {
    id: "tac-2023-11-21-fall",
    date: "2023-11-21",
    title: "Fall TAC Meeting (Nov 2023)",
    documents: [
      { name: "TAC Report", path: "/meetings/2023-11-21_Fall/Jaycee TAC report 2023 Fall.pdf" },
    ],
  },
  {
    id: "tac-2024-04-22-spring",
    date: "2024-04-22",
    title: "Spring TAC Meeting (Apr 2024)",
    documents: [
      { name: "Thesis Advisory Committee Evaluation Form (Signed)", path: "/meetings/2024-04-22_Spring/Jaycee Spring 2024 Thesis Advisory Committee Evaluation Form_signed.pdf" },
      { name: "TAC Report", path: "/meetings/2024-04-22_Spring/Jaycee TAC report 2024 Spring.pdf" },
    ],
  },
  {
    id: "tac-2024-11-22-fall",
    date: "2024-11-22",
    title: "Fall TAC Meeting (Nov 2024)",
    documents: [
      { name: "Training and Career Goals Progress Report", path: "/meetings/2024-11-22_Fall/20241122 Training and Career Goals Progress Report Jaycee.pdf" },
      { name: "Thesis Advisory Committee Evaluation Form (Signed)", path: "/meetings/2024-11-22_Fall/Jaycee Fall 2024 Thesis Advisory Committee Evaluation Form_signed.pdf" },
      { name: "TAC Report", path: "/meetings/2024-11-22_Fall/Jaycee TAC report 2024 Fall.pdf" },
    ],
  },
  {
    id: "tac-2025-04-28-spring",
    date: "2025-04-28",
    title: "Spring TAC Meeting (Apr 2025)",
    documents: [
      { name: "TAC Report", path: "/meetings/2025-04-28_Spring/Jaycee TAC report 2025 Spring.pdf" },
      { name: "Thesis Advisory Committee Evaluation Form", path: "/meetings/2025-04-28_Spring/Jaycee Spring 2025 Thesis Advisory Committee Evaluation Form.pdf" },
    ],
  },
].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Sort meetings descending by date 