"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { cacheBroadcastState, getCachedBroadcastState, cacheMatch, getCachedMatch } from "@/lib/offline/db";
import type { BroadcastState, Match } from "@/lib/supabase/types";
import ScoreboardOverlay from "@/components/overlays/ScoreboardOverlay";
import LowerThirdOverlay from "@/components/overlays/LowerThirdOverlay";

export default function OutputPage() {
  const [state, setState] = useState<BroadcastState | null>(null);
  const [match, setMatch] = useState<Match | null>(null);
  const [online, setOnline] = useState(true);

  const loadFromCache = useCallback(async () => {
    const cached = await getCachedBroadcastState();
    if (cached) setState(cached);
    if (cached?.match_id) {
      const cachedMatch = await getCachedMatch(cached.match_id);
      if (cachedMatch) setMatch(cachedMatch);
    }
  }, []);

  useEffect(() => {
    const supabase = createClient();

    async function init() {
      // Load from cache first for instant display
      await loadFromCache();

      // Fetch live data
      const { data: stateData } = await supabase
        .from("broadcast_state")
        .select("*")
        .eq("id", "main")
        .single();

      if (stateData) {
        setState(stateData);
        await cacheBroadcastState(stateData);

        if (stateData.match_id) {
          const { data: matchData } = await supabase
            .from("matches")
            .select("*")
            .eq("id", stateData.match_id)
            .single();
          if (matchData) {
            setMatch(matchData);
            await cacheMatch(matchData);
          }
        }
      }
    }

    init();

    // Subscribe to real-time broadcast state changes
    const channel = supabase
      .channel("broadcast-output")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "broadcast_state" },
        async (payload) => {
          const updated = payload.new as BroadcastState;
          setState(updated);
          await cacheBroadcastState(updated);
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "matches" },
        async (payload) => {
          const updated = payload.new as Match;
          setMatch(updated);
          await cacheMatch(updated);
        }
      )
      .subscribe();

    const handleOnline = () => setOnline(true);
    const handleOffline = () => { setOnline(false); loadFromCache(); };
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      supabase.removeChannel(channel);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [loadFromCache]);

  if (!state?.is_live || !state.active_overlay) return null;

  return (
    <div style={{ width: "1920px", height: "1080px", position: "relative", overflow: "hidden" }}>
      {!online && (
        <div style={{
          position: "absolute", top: 8, right: 8, background: "rgba(220,38,38,0.8)",
          color: "white", fontSize: 11, padding: "2px 8px", borderRadius: 4, fontFamily: "monospace"
        }}>
          OFFLINE
        </div>
      )}

      {state.active_overlay === "scoreboard" && match && (
        <ScoreboardOverlay match={match} />
      )}
      {state.active_overlay === "lower_third" && (
        <LowerThirdOverlay data={state.overlay_data} />
      )}
    </div>
  );
}
