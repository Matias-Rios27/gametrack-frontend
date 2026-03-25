import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const params = Object.fromEntries(searchParams.entries());

  // 1. Verify the assertion with Steam
  const verificationParams = new URLSearchParams(params);
  verificationParams.set("openid.mode", "check_authentication");

  console.log("Steam Callback params received:", params);

  try {
    const response = await fetch("https://steamcommunity.com/openid/login", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: verificationParams.toString(),
    });

    const text = await response.text();
    console.log("Steam verification response:", text);

    const isValid = text.includes("is_valid:true");

    if (!isValid) {
      console.warn("Steam validation failed – is_valid:true not found.");
      return NextResponse.redirect(new URL("/profile?error=steam_auth_failed", request.url));
    }

    // 2. Extract SteamID from claimed_id
    // claimed_id format: https://steamcommunity.com/openid/id/<STEAMID>
    const claimedId = params["openid.claimed_id"];
    const steamId = claimedId.split("/").pop();

    if (!steamId || !/^\d{17}$/.test(steamId)) {
        return NextResponse.redirect(new URL("/profile?error=invalid_steam_id", request.url));
    }

    // 3. Redirect back to profile with the SteamID
    // The frontend ProfilePage will detect this and link it to the current user
    return NextResponse.redirect(new URL(`/profile?linked_steam_id=${steamId}`, request.url));
  } catch (error) {
    console.error("Steam OpenID Error:", error);
    return NextResponse.redirect(new URL("/profile?error=internal_error", request.url));
  }
}
