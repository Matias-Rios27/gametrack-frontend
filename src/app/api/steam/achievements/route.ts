import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const steamid = searchParams.get("steamid");
  const appid = searchParams.get("appid");

  if (!steamid || !appid) {
    return NextResponse.json({ error: "Missing steamid or appid parameter" }, { status: 400 });
  }

  const apiKey = process.env.STEAM_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Server missing Steam API Key" }, { status: 500 });
  }

  try {
    const response = await fetch(
      `http://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?key=${apiKey}&steamid=${steamid}&appid=${appid}&format=json`
    );

    if (!response.ok) {
      if (response.status === 403) {
        return NextResponse.json({ 
          error: "PRIVACY_ERROR", 
          message: "Tu perfil de Steam es privado o no permite el acceso a los detalles de juegos." 
        }, { status: 200 }); // Returning 200 so the frontend can handle the logic without a console error
      }
      
      const errorText = await response.text();
      return NextResponse.json({ 
        error: "STEAM_API_ERROR", 
        message: "Error de la API de Steam",
        details: errorText 
      }, { status: 200 });
    }

    const data = await response.json();
    
    if (data.playerstats?.success === false) {
       return NextResponse.json({ error: data.playerstats.error || "Game may not have achievements or profile is private" }, { status: 404 });
    }

    const achievements = data.playerstats.achievements || [];
    const achievedCount = achievements.filter((a: any) => a.achieved === 1).length;
    const totalCount = achievements.length;

    return NextResponse.json({
      achieved: achievedCount,
      total: totalCount,
      percentage: totalCount > 0 ? Math.round((achievedCount / totalCount) * 100) : 0,
      achievements: achievements
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
