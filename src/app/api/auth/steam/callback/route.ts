import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const params = Object.fromEntries(searchParams.entries());

  // 1. Verify the assertion by making a request back to Steam
  const verificationParams = {
    ...params,
    "openid.mode": "check_authentication",
  };

  try {
    const res = await fetch("https://steamcommunity.com/openid/login", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(verificationParams).toString(),
    });

    const text = await res.text();
    const isResponseValid = text.includes("is_valid:true");

    if (!isResponseValid) {
      return NextResponse.redirect(new URL("/login?error=Steam verification failed", request.url));
    }

    // 2. Extract SteamID64 from openid.claimed_id or openid.identity
    const claimedId = params["openid.claimed_id"];
    const steamId = claimedId?.split("/").pop();

    if (!steamId) {
      return NextResponse.redirect(new URL("/login?error=Could not extract SteamID", request.url));
    }

    // 3. Redirect back to frontend with the SteamID
    // Note: In a real app, you'd generate a custom token here using firebase-admin.
    // For now, we'll pass it to a special handle page or the login page.
    return NextResponse.redirect(new URL(`/login?steamId=${steamId}`, request.url));
  } catch (error) {
    console.error("Steam Auth Callback Error:", error);
    return NextResponse.redirect(new URL("/login?error=Internal Server Error during Steam callback", request.url));
  }
}
