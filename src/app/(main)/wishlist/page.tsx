"use client"

import { useEffect, useState } from "react"
import { Heart, Plus, Trash2, ArrowUpCircle, MinusCircle, ArrowDownCircle } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext"
import { getUserWishlist, WishlistItem } from "@/lib/services/wishlist"

export default function WishlistPage() {
  const { user, userData, loading } = useAuth();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [steamWishlist, setSteamWishlist] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        try {
          const localWishlist = await getUserWishlist(user.uid);
          setItems(localWishlist);

          if (userData?.steamId) {
            const steamRes = await fetch(`/api/steam/wishlist?steamid=${userData.steamId}`);
            if (steamRes.ok) {
                const steamData = await steamRes.json();
                // steamData is an object with appids as keys
                const steamItems = Object.keys(steamData).map(appid => ({
                    id: `steam-wl-${appid}`,
                    appid,
                    ...steamData[appid]
                }));
                setSteamWishlist(steamItems);
            }
          }
        } catch (err) {
          console.error("Error fetching wishlist data", err);
        } finally {
          setDataLoading(false);
        }
      };
      
      fetchData();
    } else if (!loading) {
      setDataLoading(false);
    }
  }, [user, loading, userData]);

  if (loading || dataLoading) {
    return <div className="p-8 text-center text-slate-400">Cargando wishlist...</div>;
  }

  if (!user) {
    return <div className="p-8 text-center text-muted">Inicia sesión para ver tu wishlist.</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Heart className="h-8 w-8 text-electric-blue" />
            Wishlist
          </h1>
          <p className="text-muted">Tus juegos más esperados y deseados.</p>
        </div>
        <Link href="/wishlist/new">
          <Button className="gap-2 bg-electric-blue hover:bg-electric-blue/90 shadow-electric-blue/20 text-black">
            <Plus className="h-5 w-5" />
            Añadir a Wishlist
          </Button>
        </Link>
      </div>
      <div className="flex flex-col gap-4">
        {items.length === 0 ? (
          <div className="text-center py-16 bg-card-bg rounded-xl border border-dashed border-border-color w-full mt-4">
            <p className="text-muted mb-4">Tu wishlist está vacía.</p>
          </div>
        ) : (
          items.map((item) => (
            <Card key={item.id} className="bg-card-bg border-border-color transition-colors hover:border-electric-blue">
              <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="h-16 w-16 bg-gradient-to-br from-electric-blue/20 to-transparent rounded-lg shrink-0 flex items-center justify-center overflow-hidden relative border border-border-color">
                  {item.juego?.portada_url ? (
                    <img src={item.juego.portada_url} alt="Portada" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay" />
                  ) : (
                    <Heart className="h-8 w-8 text-rose-500/50" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-foreground truncate group-hover:text-electric-blue transition-colors">{item.juego?.titulo || "Juego Desconocido"}</h3>
                  <div className="flex items-center gap-3 mt-1 text-sm text-muted">
                    <span className="flex items-center gap-1">
                      {item.prioridad === 'alta' && <ArrowUpCircle className="h-4 w-4 text-electric-blue" />}
                      {item.prioridad === 'media' && <MinusCircle className="h-4 w-4 text-amber-500" />}
                      {item.prioridad === 'baja' && <ArrowDownCircle className="h-4 w-4 text-blue-500" />}
                      Prioridad <span className="capitalize">{item.prioridad}</span>
                    </span>
                  </div>
                </div>
                <div className="mt-4 sm:mt-0 flex flex-row sm:flex-col gap-2 w-full sm:w-auto">
                  <Button variant="outline" className="w-full sm:w-auto gap-2 border-electric-blue/30 text-electric-blue hover:bg-electric-blue/10">
                    <Heart className="h-4 w-4 fill-current text-electric-blue border-none" />
                    Comprado
                  </Button>
                  <Button variant="ghost" size="icon" className="text-muted hover:text-red-400 hover:bg-red-500/10 shrink-0">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {steamWishlist.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-3 mb-6">
            <img src="/steam-icon.svg" alt="Steam" className="w-6 h-6" onError={(e) => (e.target as any).style.display='none'} />
            Steam Wishlist
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {steamWishlist.map((item) => (
              <Card key={item.id} className="bg-card-bg border-border-color hover:border-electric-blue overflow-hidden group">
                <div className="aspect-video w-full relative bg-gray-800">
                    <img src={item.capsule} alt={item.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <div className="absolute top-2 right-2">
                        <Badge variant="outline" className="bg-black/60 backdrop-blur-md border-white/20 text-white">
                           Steam
                        </Badge>
                    </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold text-foreground truncate" title={item.name}>{item.name}</h3>
                  <div className="flex items-center justify-between mt-3">
                    <div className="text-xs text-muted">
                        {item.release_string || "Próximamente"}
                    </div>
                    {item.subs && item.subs[0] && (
                        <div className="text-sm font-semibold text-emerald-400">
                            {item.subs[0].price ? `${(item.subs[0].price / 100).toFixed(2)} USD` : "Pronto"}
                        </div>
                    )}
                  </div>
                  <Button variant="outline" className="w-full mt-4 text-xs border-electric-blue/30 text-electric-blue hover:bg-electric-blue/10 gap-2">
                    Ver en Steam
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
