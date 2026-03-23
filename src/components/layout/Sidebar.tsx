"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Library, PlusCircle, Heart, BookText, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Mis Juegos", href: "/games", icon: Library },
  { name: "Añadir Juego", href: "/games/add", icon: PlusCircle },
  { name: "Wishlist", href: "/wishlist", icon: Heart },
  { name: "Diario", href: "/diary", icon: BookText },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 border-r border-slate-800 bg-slate-950/30 hidden md:block">
      <div className="flex flex-col gap-2 p-4 h-full">
        <nav className="flex-1 space-y-1">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-3">
            Menú Principal
          </div>
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                  isActive
                    ? "bg-electric-blue/10 text-electric-blue border-l-2 border-electric-blue shadow-[inset_2px_0_10px_rgba(0,240,255,0.1)]"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 hover:border-l-2 hover:border-neon-green/50"
                )}
              >
                <item.icon className={cn("h-5 w-5 flex-shrink-0 transition-colors", isActive ? "text-electric-blue" : "text-slate-500 group-hover:text-neon-green")} />
                {item.name}
              </Link>
            )
          })}
        </nav>
        
        <div className="mt-auto">
          <Link
            href="/settings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 transition-all group"
          >
            <Settings className="h-5 w-5 flex-shrink-0 text-slate-500 group-hover:text-slate-300" />
            Configuración
          </Link>
        </div>
      </div>
    </div>
  )
}
