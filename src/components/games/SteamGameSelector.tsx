import React, { useState, useEffect } from "react";
import { Search, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface SteamGameSelectorProps {
  steamId: string;
  onSelectGame: (game: any) => void;
}

export function SteamGameSelector({ steamId, onSelectGame }: SteamGameSelectorProps) {
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let isMounted = true;
    const fetchGames = async () => {
      try {
        const res = await fetch(`/api/steam/games?steamid=${steamId}`);
        const data = await res.json();
        if (data.response?.games && isMounted) {
          // Sort games by playtime descending
          const sorted = data.response.games.sort((a: any, b: any) => b.playtime_forever - a.playtime_forever);
          setGames(sorted);
        }
      } catch (err: any) {
        if (isMounted) setError(err.message || "Error cargando juegos de Steam");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchGames();
    return () => { isMounted = false; };
  }, [steamId]);

  const filteredGames = games.filter(g =>
    g.name.toLowerCase().includes(searchTerm.toLowerCase())
  ); // Show all filtered games

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-muted">
        <Loader2 className="w-8 h-8 animate-spin text-electric-blue mb-4" />
        <p>Cargando tu biblioteca de Steam...</p>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-500 bg-red-500/10 rounded-lg">{error}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
        <Input
          type="text"
          placeholder="Buscar en tu biblioteca de Steam..."
          className="pl-9 bg-background/50 border-electric-blue/30 focus:border-electric-blue"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {filteredGames.length > 0 ? (
          filteredGames.map(game => {
            const coverUrl = `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${game.appid}/library_600x900_2x.jpg`;
            const hours = Math.floor((game.playtime_forever || 0) / 60);

            return (
              <div
                key={game.appid}
                className="group relative rounded-xl overflow-hidden border border-border-color bg-card-bg cursor-pointer hover:border-electric-blue hover:ring-2 hover:ring-electric-blue/50 transition-all flex flex-col"
                onClick={() => onSelectGame({ ...game, coverUrl, hours })}
              >
                <div className="aspect-[2/3] w-full relative bg-gray-800">
                  <img
                    src={coverUrl}
                    alt={game.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `http://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`;
                      (e.target as HTMLImageElement).className = "absolute inset-0 w-full h-full object-contain p-4";
                    }}
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3 pt-12">
                    <p className="text-white text-xs font-semibold truncate" title={game.name}>{game.name}</p>
                    <p className="text-gray-300 text-[10px]">{hours} hrs jugadas</p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-electric-blue/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                  <div className="bg-electric-blue text-black p-2 rounded-full transform scale-75 group-hover:scale-100 transition-transform">
                    <Plus className="w-6 h-6" />
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-8 text-center text-muted">
            {searchTerm ? "No se encontraron juegos con ese nombre." : "Tu biblioteca está vacía."}
          </div>
        )}
      </div>
    </div>
  );
}
