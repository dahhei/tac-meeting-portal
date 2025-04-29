import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { MeetingList } from "@/components/meeting-list"

export default function Dashboard() {
  // Check authentication on the server
  const authCookie = cookies().get("auth")

  if (!authCookie) {
    redirect("/")
  }

  try {
    const { role, username } = JSON.parse(authCookie.value)

    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">TAC Meeting Materials</h1>
        <p className="mb-6">Welcome, {username}. You are viewing TAC meeting materials in read-only mode.</p>

        <MeetingList viewOnly={true} />
      </div>
    )
  } catch (error) {
    redirect("/")
  }
}
