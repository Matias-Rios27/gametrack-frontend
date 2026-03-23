"use client"

import { Heart, Plus, Trash2, ArrowUpCircle, MinusCircle, ArrowDownCircle } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import Link from "next/link"

const wishlistItems = [
  { id: 1, title: "Elden Ring: Shadow of the Erdtree", priority: "alta", price: "$39.99" },
  { id: 2, title: "Zelda: Echoes of Wisdom", priority: "alta", price: "$59.99" },
  { id: 3, title: "Silksong", priority: "media", price: "TBD" },
  { id: 4, title: "Grand Theft Auto VI", priority: "baja", price: "TBD" },
]

export default function WishlistPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Heart className="h-8 w-8 text-rose-500" />
            Wishlist
          </h1>
          <p className="text-slate-400">Tus juegos más esperados y deseados.</p>
        </div>
        <Link href="/wishlist/new">
          <Button className="gap-2 bg-rose-600 hover:bg-rose-700 shadow-rose-500/20 text-white">
            <Plus className="h-5 w-5" />
            Añadir a Wishlist
          </Button>
        </Link>
      </div>

      <div className="flex flex-col gap-4">
        {wishlistItems.map((item) => (
          <Card key={item.id} className="bg-slate-900/60 border-slate-800 transition-colors hover:border-slate-700">
            <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="h-16 w-16 bg-gradient-to-br from-rose-900/50 to-slate-800 rounded-lg shrink-0 flex items-center justify-center">
                 <Heart className="h-8 w-8 text-rose-500/50" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-white truncate">{item.title}</h3>
                <div className="flex items-center gap-3 mt-1 text-sm text-slate-400">
                  <span className="flex items-center gap-1">
                    {item.priority === 'alta' && <ArrowUpCircle className="h-4 w-4 text-rose-500" />}
                    {item.priority === 'media' && <MinusCircle className="h-4 w-4 text-amber-500" />}
                    {item.priority === 'baja' && <ArrowDownCircle className="h-4 w-4 text-blue-500" />}
                    Prioridad <span className="capitalize">{item.priority}</span>
                  </span>
                  <span>•</span>
                  <span>{item.price}</span>
                </div>
              </div>
              <div className="mt-4 sm:mt-0 flex flex-row sm:flex-col gap-2 w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto gap-2">
                  <Heart className="h-4 w-4 fill-current text-rose-500 border-none" />
                  Comprado
                </Button>
                <Button variant="ghost" size="icon" className="text-slate-500 hover:text-red-400 hover:bg-red-500/10 shrink-0">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
