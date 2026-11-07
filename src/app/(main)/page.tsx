"use client";

import { ContinueHero } from "@/components/dashboard/ContinueHero";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { PriorityWishlist } from "@/components/dashboard/PriorityWishlist";
import { StatsStrip } from "@/components/dashboard/StatsStrip";
import { SteamLibraryRail } from "@/components/dashboard/SteamLibraryRail";
import { useDashboardData } from "@/hooks/useDashboardData";

// Juegos activos que se muestran junto al principal en el hero
const OTHER_ACTIVE_VISIBLE = 4;

export default function DashboardPage() {
  const data = useDashboardData();

  if (data.loading) return <DashboardSkeleton />;

  const [featured, ...others] = data.activeGames;

  return (
    <div className="flex flex-col gap-12">
      <ContinueHero game={featured} others={others.slice(0, OTHER_ACTIVE_VISIBLE)} />

      <StatsStrip
        completed={data.completedCount}
        playing={data.activeGames.length}
        localHours={data.localHours}
        steamHours={data.steamHours}
        hasSteam={data.steamLibrary.length > 0}
        spentUsd={data.spentUsd}
        steamGames={data.steamLibrary.length}
      />

      {data.steamLibrary.length > 0 && <SteamLibraryRail games={data.steamLibrary} />}

      <PriorityWishlist items={data.priorityWishlist} />
    </div>
  );
}
