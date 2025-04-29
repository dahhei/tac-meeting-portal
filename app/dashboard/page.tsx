import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { MeetingList } from "@/components/meeting-list"

export default async function Dashboard() {
  // Check authentication on the server
  const cookieStore = cookies()
  const authCookie = cookieStore.get("auth")

  if (!authCookie) {
    redirect("/") // Redirect to login if not authenticated
  }

  let username: string | undefined = undefined;
  try {
    // Attempt to parse the cookie value to check if it's valid
    const parsedCookie = JSON.parse(authCookie.value);
    username = parsedCookie.username; // Extract username if available

    // Role-based logic example (currently unused by MeetingList)
    // const userRole = parsedCookie.role;
    // const canEdit = userRole === 'admin';

    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">TAC Meeting Materials</h1>
        {/* Optional: Display username if available */}
        {username && <p className="mb-6">Welcome, {username}.</p>}

        {/* MeetingList component currently doesn't use viewOnly or role-based props */}
        <MeetingList />
      </div>
    )
  } catch (error) {
    // If cookie parsing fails (invalid format), redirect to login
    console.error("Auth cookie parsing error:", error)
    redirect("/")
  }
}
