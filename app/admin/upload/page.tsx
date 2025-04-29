import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import UploadForm from "@/components/upload-form"

export default function UploadPage() {
  // Check authentication on the server
  const authCookie = cookies().get("auth")

  if (!authCookie) {
    redirect("/")
  }

  try {
    const { role } = JSON.parse(authCookie.value)

    if (role !== "admin") {
      redirect("/dashboard")
    }

    return (
      <div className="container mx-auto py-8 px-4 max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">Upload TAC Meeting Files</h1>
        <UploadForm />
      </div>
    )
  } catch (error) {
    redirect("/")
  }
}
