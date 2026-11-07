// Tipos y URLs de imagenes publicas de Steam

export interface SteamOwnedGame {
  appid: number
  name: string
  playtime_forever: number
  playtime_2weeks?: number
}

const CDN = "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps"

// Portada vertical (600x900)
export const steamCoverUrl = (appid: number) => `${CDN}/${appid}/library_600x900_2x.jpg`

// Arte horizontal para fondos de hero
export const steamHeroUrl = (appid: number) => `${CDN}/${appid}/library_hero.jpg`

// Pagina de la tienda
export const steamStoreUrl = (appid: number) => `https://store.steampowered.com/app/${appid}`

// Minutos a horas enteras
export const toHours = (minutes: number) => Math.floor(minutes / 60)

// Juegos populares para el fondo cuando el usuario no tiene Steam vinculado
export const FEATURED_APPIDS = [
  1245620, 1091500, 292030, 1174180, 413150, 1145360, 367520, 271590, 814380, 1086940,
  1593500, 2050650, 553850, 1888930, 374320, 105600, 620, 252950, 1817070, 990080,
]

// Una sola peticion por steamId: el dashboard y el fondo comparten el resultado
const libraryCache = new Map<string, Promise<SteamOwnedGame[]>>()

// La biblioteca es opcional: si falla devuelve [] y se puede reintentar despues
export function fetchSteamLibrary(steamId: string): Promise<SteamOwnedGame[]> {
  const cached = libraryCache.get(steamId)
  if (cached) return cached

  const request = fetch(`/api/steam/games?steamid=${encodeURIComponent(steamId)}`)
    .then((res) => res.json())
    .then((data) => (data.response?.games ?? []) as SteamOwnedGame[])
    .catch((error) => {
      console.error("Error al cargar la biblioteca de Steam", error)
      libraryCache.delete(steamId)
      return []
    })

  libraryCache.set(steamId, request)
  return request
}
