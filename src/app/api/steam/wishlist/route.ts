import { NextResponse } from "next/server";

// Steam retiro store.steampowered.com/wishlist/.../wishlistdata (ahora responde 302 a HTML).
// Reemplazo oficial: IWishlistService/GetWishlist (appids) + IStoreBrowseService/GetItems (datos de tienda).

const API = "https://api.steampowered.com";
const ASSETS_CDN = "https://shared.akamai.steamstatic.com/store_item_assets";
// Tamaño de lote por llamada a GetItems
const BATCH_SIZE = 100;

interface WishlistEntry {
  appid: number;
  priority: number;
  date_added: number;
}

interface StoreItem {
  appid: number;
  name?: string;
  assets?: { asset_url_format?: string; main_capsule?: string; header?: string };
  release?: { steam_release_date?: number; is_coming_soon?: boolean };
  best_purchase_option?: { final_price_in_cents?: string; discount_pct?: number };
}

// Forma que ya consume la vista de wishlist
interface WishlistGame {
  name: string;
  capsule: string | null;
  release_string: string | null;
  priority: number;
  added: number;
  subs: { price: number; discount_pct: number }[];
}

const capsuleUrl = (assets: StoreItem["assets"]) => {
  const file = assets?.main_capsule || assets?.header;
  if (!assets?.asset_url_format || !file) return null;
  return `${ASSETS_CDN}/${assets.asset_url_format.replace("${FILENAME}", file)}`;
};

const releaseString = (release: StoreItem["release"]) => {
  if (release?.is_coming_soon) return "Próximamente";
  if (!release?.steam_release_date) return null;
  return new Date(release.steam_release_date * 1000).toLocaleDateString("es-CL", { year: "numeric", month: "short", day: "numeric" });
};

async function getStoreItems(appids: number[]): Promise<StoreItem[]> {
  const batches: number[][] = [];
  for (let i = 0; i < appids.length; i += BATCH_SIZE) batches.push(appids.slice(i, i + BATCH_SIZE));

  const results = await Promise.all(
    batches.map(async (batch) => {
      const input = {
        ids: batch.map((appid) => ({ appid })),
        context: { language: "spanish", country_code: "US" },
        data_request: { include_assets: true, include_release: true },
      };
      const url = `${API}/IStoreBrowseService/GetItems/v1/?input_json=${encodeURIComponent(JSON.stringify(input))}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`GetItems respondió ${res.status}`);
      const data = await res.json();
      return (data.response?.store_items ?? []) as StoreItem[];
    })
  );
  return results.flat();
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const steamid = searchParams.get("steamid");

  // SteamID64: 17 digitos
  if (!steamid || !/^\d{17}$/.test(steamid)) {
    return NextResponse.json({ error: "Parámetro steamid inválido" }, { status: 400 });
  }

  try {
    const wishlistRes = await fetch(`${API}/IWishlistService/GetWishlist/v1/?steamid=${steamid}`);
    if (!wishlistRes.ok) throw new Error(`GetWishlist respondió ${wishlistRes.status}`);

    const wishlistData = await wishlistRes.json();
    const entries: WishlistEntry[] = wishlistData.response?.items ?? [];
    // Wishlist vacia o privada
    if (entries.length === 0) return NextResponse.json({});

    const storeItems = await getStoreItems(entries.map((entry) => entry.appid));
    const byAppid = new Map(storeItems.map((item) => [item.appid, item]));

    const result: Record<string, WishlistGame> = {};
    for (const entry of entries) {
      const item = byAppid.get(entry.appid);
      // Juegos retirados de la tienda vienen sin nombre
      if (!item?.name) continue;

      const price = Number(item.best_purchase_option?.final_price_in_cents ?? 0);
      result[entry.appid] = {
        name: item.name,
        capsule: capsuleUrl(item.assets),
        release_string: releaseString(item.release),
        priority: entry.priority,
        added: entry.date_added,
        subs: price > 0 ? [{ price, discount_pct: item.best_purchase_option?.discount_pct ?? 0 }] : [],
      };
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error al obtener la wishlist de Steam:", error);
    return NextResponse.json({ error: "No se pudo obtener la wishlist de Steam" }, { status: 502 });
  }
}
