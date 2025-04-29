import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { MeetingList } from "@/components/meeting-list"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AdminDashboard() {
  // Check authentication on the server
  const authCookie = cookies().get("auth")

  if (!authCookie) {
    redirect("/")
  }

  try {
    const { role, username } = JSON.parse(authCookie.value)

    if (role !== "admin") {
      redirect("/dashboard")
    }

    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">TAC Meeting Admin Portal</h1>
          <Link href="/admin/upload">
            <Button>Upload New Files</Button>
          </Link>
        </div>

        <p className="mb-6">Welcome, {username}. You can manage all TAC meeting materials here.</p>

        <MeetingList viewOnly={false} />
      </div>
    )
  } catch (error) {
    redirect("/")
  }
}
