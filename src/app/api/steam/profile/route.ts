import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const identifier = searchParams.get("identifier");

  if (!identifier) {
    return NextResponse.json({ error: "Missing identifier parameter" }, { status: 400 });
  }

  const apiKey = process.env.STEAM_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Server missing Steam API Key" }, { status: 500 });
  }

  try {
    let steamid = identifier;
    
    // Check if it's not a 17-digit numeric string (SteamID64)
    if (!/^\d{17}$/.test(identifier)) {
        // Resolve vanity URL
        const vanityRes = await fetch(`http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${apiKey}&vanityurl=${identifier}`);
        const vanityData = await vanityRes.json();
        if (vanityData.response.success === 1) {
            steamid = vanityData.response.steamid;
        } else {
             return NextResponse.json({ error: "Could not resolve Steam Vanity URL" }, { status: 404 });
        }
    }

    // Get Player summaries
    const sumRes = await fetch(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${steamid}`);
    const sumData = await sumRes.json();
    
    if (!sumData.response || !sumData.response.players || sumData.response.players.length === 0) {
        return NextResponse.json({ error: "Player not found" }, { status: 404 });
    }

    return NextResponse.json(sumData.response.players[0]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
