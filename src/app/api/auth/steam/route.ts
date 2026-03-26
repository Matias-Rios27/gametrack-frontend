import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const host = request.headers.get("host");
  const protocol = host?.includes("localhost") ? "http" : "https";
  const returnTo = `${protocol}://${host}/api/auth/steam/callback`;

  const steamOpenIdUrl = new URL("https://steamcommunity.com/openid/login");
  steamOpenIdUrl.searchParams.set("openid.ns", "http://specs.openid.net/auth/2.0");
  steamOpenIdUrl.searchParams.set("openid.mode", "checkid_setup");
  steamOpenIdUrl.searchParams.set("openid.return_to", returnTo);
  steamOpenIdUrl.searchParams.set("openid.realm", `${protocol}://${host}`);
  steamOpenIdUrl.searchParams.set("openid.identity", "http://specs.openid.net/auth/2.0/identifier_select");
  steamOpenIdUrl.searchParams.set("openid.claimed_id", "http://specs.openid.net/auth/2.0/identifier_select");

  return NextResponse.redirect(steamOpenIdUrl.toString());
}
