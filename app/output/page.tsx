"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { cacheBroadcastState, getCachedBroadcastState, cacheMatch, getCachedMatch } from "@/lib/offline/db";
import type { BroadcastState, Match, OverlayType, CountdownData, MatchIdData, TableData, CircuitData, LineupData } from "@/lib/supabase/types";
import CountdownGraphic from "@/components/overlays/CountdownGraphic";
import MatchIdGraphic from "@/components/overlays/MatchIdGraphic";
import StandingsGraphic from "@/components/overlays/StandingsGraphic";
import CircuitGraphic from "@/components/overlays/CircuitGraphic";
import LineupGraphic from "@/components/overlays/LineupGraphic";

type DisplayState = {
  overlay: OverlayType;
  data: Record<string, unknown>;
};

export default function OutputPage() {
  const [broadcastState, setBroadcastState] = useState<BroadcastState | null>(null);
  const [match, setMatch] = useState<Match | null>(null);
  const [online, setOnline] = useState(true);

  const [display, setDisplay] = useState<DisplayState>({ overlay: null, data: {} });
  const [opacity, setOpacity] = useState(0);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadFromCache = useCallback(async () => {
    const cached = await getCachedBroadcastState();
    if (cached) {
      setBroadcastState(cached);
      if (cached.match_id) {
        const cachedMatch = await getCachedMatch(cached.match_id);
        if (cachedMatch) setMatch(cachedMatch);
      }
    }
  }, []);

  useEffect(() => {
    const supabase = createClient();

    async function init() {
      await loadFromCache();

      const { data: stateData } = await supabase
        .from("broadcast_state").select("*").eq("id", "main").single();
      if (stateData) {
        setBroadcastState(stateData as BroadcastState);
        await cacheBroadcastState(stateData as BroadcastState);

        if ((stateData as BroadcastState).match_id) {
          const { data: matchData } = await supabase
            .from("matches").select("*").eq("id", (stateData as BroadcastState).match_id).single();
          if (matchData) { setMatch(matchData as Match); await cacheMatch(matchData as Match); }
        }
      }
    }

    init();

    const channel = supabase.channel("output-v2")
      .on("postgres_changes", { event: "*", schema: "public", table: "broadcast_state" }, async (payload) => {
        const updated = payload.new as BroadcastState;
        setBroadcastState(updated);
        await cacheBroadcastState(updated);
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "matches" }, async (payload) => {
        const updated = payload.new as Match;
        setMatch(updated);
        await cacheMatch(updated);
      })
      .subscribe();

    window.addEventListener("online", () => setOnline(true));
    window.addEventListener("offline", () => { setOnline(false); loadFromCache(); });

    return () => { supabase.removeChannel(channel); };
  }, [loadFromCache]);

  // Handle graphic transitions
  useEffect(() => {
    const isActive = broadcastState?.is_live && broadcastState.active_overlay;

    if (isActive) {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      setDisplay({ overlay: broadcastState.active_overlay, data: broadcastState.overlay_data || {} });
      requestAnimationFrame(() => requestAnimationFrame(() => setOpacity(1)));
    } else {
      setOpacity(0);
      hideTimerRef.current = setTimeout(() => setDisplay({ overlay: null, data: {} }), 600);
    }

    return () => { if (hideTimerRef.current) clearTimeout(hideTimerRef.current); };
  }, [broadcastState?.is_live, broadcastState?.active_overlay, broadcastState?.overlay_data]);

  function renderOverlay() {
    if (!display.overlay) return null;
    const d = display.data;

    switch (display.overlay) {
      case "countdown":
        return <CountdownGraphic data={d as unknown as CountdownData} />;
      case "matchid":
        return <MatchIdGraphic data={d as unknown as MatchIdData} />;
      case "table":
        return <StandingsGraphic data={d as unknown as TableData} />;
      case "circuit":
        return <CircuitGraphic data={d as unknown as CircuitData} />;
      case "lineup":
        return <LineupGraphic data={d as unknown as LineupData} />;
      default:
        return null;
    }
  }

  return (
    <div style={{ width: "1920px", height: "1080px", position: "relative", overflow: "hidden" }}>
      {/* Offline badge */}
      {!online && (
        <div style={{
          position: "absolute", top: 8, right: 8, zIndex: 999,
          background: "rgba(220,38,38,0.85)", color: "white",
          fontSize: 11, padding: "2px 8px", fontFamily: "monospace",
        }}>
          OFFLINE
        </div>
      )}

      {/* Main overlay with fade transition */}
      <div style={{
        position: "absolute", inset: 0,
        opacity,
        transition: "opacity 0.5s cubic-bezier(0.16,0.84,0.44,1)",
      }}>
        {renderOverlay()}
      </div>

    </div>
  );
}
