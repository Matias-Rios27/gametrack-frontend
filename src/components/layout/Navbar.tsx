"use client"

import Link from "next/link"
import { Gamepad2, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"

export function Navbar() {
  const { logout } = useAuth()
  const router = useRouter()
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border-color bg-card-bg backdrop-blur-xl">
      <div className="flex h-16 items-center px-6 gap-4">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-electric-blue/10 p-2 rounded-lg text-electric-blue border border-electric-blue/30 group-hover:bg-electric-blue group-hover:text-black group-hover:shadow-[0_0_15px_rgba(var(--color-electric-blue),0.6)] transition-all">
            <Gamepad2 className="h-5 w-5" />
          </div>
          <span className="font-bold text-xl tracking-tight text-foreground">GameTrack</span>
        </Link>
        <div className="ml-auto flex items-center gap-4">
          <Link href="/profile">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-electric-blue/20 hover:text-electric-blue group transition-all">
              <User className="h-5 w-5 text-muted group-hover:text-electric-blue" />
            </Button>
          </Link>
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full text-red-400 hover:text-red-300 hover:bg-red-500/10"
            onClick={async () => {
              await logout();
              router.push("/login");
            }}
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </nav>
  )
}
