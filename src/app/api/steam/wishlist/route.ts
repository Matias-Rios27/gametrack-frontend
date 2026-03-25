import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const steamid = searchParams.get("steamid");

  if (!steamid) {
    return NextResponse.json({ error: "Missing steamid parameter" }, { status: 400 });
  }

  try {
    // Steam doesn't have a direct "GetWishlist" Web API in the IPlayerService that is public/easy for all apps
    // However, the big-picture store API often works: store.steampowered.com/wishlist/profiles/<STEAMID>/wishlistdata/
    const response = await fetch(
      `https://store.steampowered.com/wishlist/profiles/${steamid}/wishlistdata/`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch steam wishlist");
    }

    const data = await response.json();
    // This returns an object where keys are AppIDs
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
