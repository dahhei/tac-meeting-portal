import type React from "react"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import NavBar from "@/components/nav-bar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check authentication on the server
  const authCookie = cookies().get("auth")

  if (!authCookie) {
    redirect("/")
  }

  try {
    const { role } = JSON.parse(authCookie.value)

    return (
      <div className="min-h-screen flex flex-col">
        <NavBar role={role as "admin" | "user"} />
        <main className="flex-1 bg-gray-50">{children}</main>
      </div>
    )
  } catch (error) {
    redirect("/")
  }
}
