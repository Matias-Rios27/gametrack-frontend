"use client"

import Link from "next/link"
import { Gamepad2, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/Button"

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/60 backdrop-blur-xl">
      <div className="flex h-16 items-center px-6 gap-4">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-neon-green/10 p-2 rounded-lg text-neon-green border border-neon-green/30 group-hover:bg-neon-green group-hover:text-black group-hover:shadow-[0_0_15px_rgba(57,255,20,0.6)] transition-all">
            <Gamepad2 className="h-5 w-5" />
          </div>
          <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">GameTrack</span>
        </Link>
        <div className="ml-auto flex items-center gap-4">
          <Link href="/profile">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-electric-blue/20 hover:text-electric-blue group transition-all">
              <User className="h-5 w-5 text-slate-300 group-hover:text-electric-blue" />
            </Button>
          </Link>
          <Button variant="ghost" size="icon" className="rounded-full text-red-400 hover:text-red-300 hover:bg-red-500/10">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </nav>
  )
}
