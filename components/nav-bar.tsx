"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { LogOut, Menu, X } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"

export default function NavBar({ role }: { role: "admin" | "user" }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      })

      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      })

      router.push("/")
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <nav className="bg-card shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href={role === "admin" ? "/admin" : "/dashboard"} className="font-bold text-xl">
              TAC Portal
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            {role === "admin" && (
              <>
                <Link href="/admin">
                  <Button variant="ghost">Dashboard</Button>
                </Link>
                <Link href="/admin/upload">
                  <Button variant="ghost">Upload Files</Button>
                </Link>
              </>
            )}
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
            <ThemeToggle />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X /> : <Menu />}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-2">
              {role === "admin" && (
                <>
                  <Link href="/admin" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">
                      Dashboard
                    </Button>
                  </Link>
                  <Link href="/admin/upload" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">
                      Upload Files
                    </Button>
                  </Link>
                </>
              )}
              <Button variant="outline" onClick={handleLogout} className="w-full justify-start">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
