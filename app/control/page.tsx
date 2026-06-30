"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Match, BroadcastState, OverlayType } from "@/lib/supabase/types";

const supabase = createClient();

const STATUS_LABELS = { pre: "Pre-Match", live: "Live", ht: "Half Time", ft: "Full Time" } as const;

type PartialMatch = {
  id?: string;
  home_team: string;
  away_team: string;
  home_score: number;
  away_score: number;
  match_time: string;
  status: Match["status"];
  venue: string | null;
  competition: string | null;
};

export default function ControlPage() {
  const [match, setMatch] = useState<PartialMatch>({
    home_team: "", away_team: "", home_score: 0, away_score: 0,
    match_time: "00:00", status: "pre", venue: null, competition: null,
  });
  const [state, setState] = useState<BroadcastState | null>(null);
  const [lowerThirdTitle, setLowerThirdTitle] = useState("");
  const [lowerThirdSub, setLowerThirdSub] = useState("");
  const [saving, setSaving] = useState(false);
  const [online, setOnline] = useState(true);

  const load = useCallback(async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: stateData } = await (supabase as any)
      .from("broadcast_state").select("*").eq("id", "main").single();
    if (stateData) {
      setState(stateData as BroadcastState);
      if ((stateData as BroadcastState).match_id) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: matchData } = await (supabase as any)
          .from("matches").select("*").eq("id", (stateData as BroadcastState).match_id).single();
        if (matchData) setMatch(matchData as Match);
      }
    }
  }, []);

  useEffect(() => {
    load();
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [load]);

  async function saveMatch() {
    setSaving(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const db = supabase as any;
      const payload = {
        home_team: match.home_team, away_team: match.away_team,
        home_score: match.home_score, away_score: match.away_score,
        match_time: match.match_time, status: match.status,
        venue: match.venue, competition: match.competition,
      };
      if (match.id) {
        await db.from("matches").update(payload).eq("id", match.id);
      } else {
        const { data } = await db.from("matches").insert(payload).select().single();
        if (data) {
          setMatch((prev) => ({ ...prev, id: (data as Match).id }));
          await db.from("broadcast_state").update({ match_id: (data as Match).id }).eq("id", "main");
        }
      }
    } finally {
      setSaving(false);
    }
  }

  async function setOverlay(overlay: OverlayType) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabase as any;
    const overlayData = overlay === "lower_third"
      ? { title: lowerThirdTitle, subtitle: lowerThirdSub }
      : {};
    await db.from("broadcast_state").update({
      active_overlay: overlay,
      overlay_data: overlayData,
      is_live: overlay !== null,
      match_id: match.id ?? null,
    }).eq("id", "main");
    setState((prev) => prev ? { ...prev, active_overlay: overlay, is_live: overlay !== null } : prev);
  }

  async function adjustScore(team: "home" | "away", delta: number) {
    const field = team === "home" ? "home_score" : "away_score";
    const current = team === "home" ? match.home_score : match.away_score;
    const newScore = Math.max(0, current + delta);
    setMatch((prev) => ({ ...prev, [field]: newScore }));
    if (match.id) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any).from("matches").update({ [field]: newScore }).eq("id", match.id);
    }
  }

  const isActive = (overlay: OverlayType) => state?.active_overlay === overlay && state?.is_live;

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-6 font-sans">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">MPFL GFX Control</h1>
          {match.competition && <p className="text-neutral-400 text-sm">{match.competition}</p>}
        </div>
        <div className="flex items-center gap-3">
          {!online && (
            <span className="bg-red-600 text-white text-xs px-2 py-1 rounded font-mono">OFFLINE</span>
          )}
          <a href="/output" target="_blank"
            className="text-xs bg-neutral-800 hover:bg-neutral-700 px-3 py-1.5 rounded text-neutral-300">
            Open Output ↗
          </a>
          <div className={`px-3 py-1.5 rounded text-sm font-semibold ${state?.is_live ? "bg-red-600 animate-pulse" : "bg-neutral-800 text-neutral-400"}`}>
            {state?.is_live ? "● ON AIR" : "OFF AIR"}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Match Setup */}
        <section className="bg-neutral-900 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-neutral-400 uppercase tracking-widest mb-4">Match Setup</h2>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="text-xs text-neutral-500 mb-1 block">Home Team</label>
              <input value={match.home_team} onChange={(e) => setMatch((p) => ({ ...p, home_team: e.target.value }))}
                className="w-full bg-neutral-800 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500"
                placeholder="Home Team" />
            </div>
            <div>
              <label className="text-xs text-neutral-500 mb-1 block">Away Team</label>
              <input value={match.away_team} onChange={(e) => setMatch((p) => ({ ...p, away_team: e.target.value }))}
                className="w-full bg-neutral-800 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500"
                placeholder="Away Team" />
            </div>
            <div>
              <label className="text-xs text-neutral-500 mb-1 block">Competition</label>
              <input value={match.competition ?? ""} onChange={(e) => setMatch((p) => ({ ...p, competition: e.target.value }))}
                className="w-full bg-neutral-800 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500"
                placeholder="e.g. MPFL 2025" />
            </div>
            <div>
              <label className="text-xs text-neutral-500 mb-1 block">Venue</label>
              <input value={match.venue ?? ""} onChange={(e) => setMatch((p) => ({ ...p, venue: e.target.value }))}
                className="w-full bg-neutral-800 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500"
                placeholder="Stadium name" />
            </div>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div>
              <label className="text-xs text-neutral-500 mb-1 block">Match Time</label>
              <input value={match.match_time} onChange={(e) => setMatch((p) => ({ ...p, match_time: e.target.value }))}
                className="bg-neutral-800 rounded px-3 py-2 text-sm w-24 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                placeholder="45:00" />
            </div>
            <div>
              <label className="text-xs text-neutral-500 mb-1 block">Status</label>
              <select value={match.status} onChange={(e) => setMatch((p) => ({ ...p, status: e.target.value as Match["status"] }))}
                className="bg-neutral-800 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500">
                {Object.entries(STATUS_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
          </div>
          <button onClick={saveMatch} disabled={saving}
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-semibold py-2 rounded text-sm disabled:opacity-50 transition-colors">
            {saving ? "Saving…" : match.id ? "Update Match" : "Create Match"}
          </button>
        </section>

        {/* Score Control */}
        <section className="bg-neutral-900 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-neutral-400 uppercase tracking-widest mb-4">Score Control</h2>
          <div className="flex items-center justify-center gap-8">
            <div className="flex flex-col items-center gap-3">
              <span className="text-sm font-medium text-neutral-300 uppercase tracking-wide">
                {match.home_team || "Home"}
              </span>
              <div className="flex items-center gap-3">
                <button onClick={() => adjustScore("home", -1)}
                  className="w-10 h-10 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-lg font-bold transition-colors">−</button>
                <span className="text-5xl font-black tabular-nums w-16 text-center">{match.home_score}</span>
                <button onClick={() => adjustScore("home", 1)}
                  className="w-10 h-10 bg-yellow-500 hover:bg-yellow-400 text-black rounded-lg text-lg font-bold transition-colors">+</button>
              </div>
            </div>
            <div className="text-neutral-600 text-3xl font-light">:</div>
            <div className="flex flex-col items-center gap-3">
              <span className="text-sm font-medium text-neutral-300 uppercase tracking-wide">
                {match.away_team || "Away"}
              </span>
              <div className="flex items-center gap-3">
                <button onClick={() => adjustScore("away", -1)}
                  className="w-10 h-10 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-lg font-bold transition-colors">−</button>
                <span className="text-5xl font-black tabular-nums w-16 text-center">{match.away_score}</span>
                <button onClick={() => adjustScore("away", 1)}
                  className="w-10 h-10 bg-yellow-500 hover:bg-yellow-400 text-black rounded-lg text-lg font-bold transition-colors">+</button>
              </div>
            </div>
          </div>
        </section>

        {/* Overlay Controls */}
        <section className="bg-neutral-900 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-neutral-400 uppercase tracking-widest mb-4">Overlays</h2>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <button onClick={() => setOverlay("scoreboard")}
              className={`py-3 rounded-lg text-sm font-semibold transition-colors ${isActive("scoreboard") ? "bg-red-600 text-white" : "bg-neutral-800 hover:bg-neutral-700 text-neutral-200"}`}>
              {isActive("scoreboard") ? "● Scoreboard ON" : "Scoreboard"}
            </button>
            <button onClick={() => setOverlay(null)}
              className="py-3 rounded-lg text-sm font-semibold bg-neutral-800 hover:bg-red-900 hover:text-red-300 text-neutral-400 transition-colors">
              Clear All
            </button>
          </div>
          <div className="border border-neutral-800 rounded-lg p-4">
            <h3 className="text-xs text-neutral-500 uppercase tracking-widest mb-3">Lower Third</h3>
            <div className="flex flex-col gap-2 mb-3">
              <input value={lowerThirdTitle} onChange={(e) => setLowerThirdTitle(e.target.value)}
                className="bg-neutral-800 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500"
                placeholder="Name / Title" />
              <input value={lowerThirdSub} onChange={(e) => setLowerThirdSub(e.target.value)}
                className="bg-neutral-800 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500"
                placeholder="Role / Subtitle" />
            </div>
            <button onClick={() => setOverlay("lower_third")}
              className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-colors ${isActive("lower_third") ? "bg-red-600 text-white" : "bg-neutral-700 hover:bg-neutral-600 text-white"}`}>
              {isActive("lower_third") ? "● Lower Third ON" : "Show Lower Third"}
            </button>
          </div>
        </section>

        {/* Status Info */}
        <section className="bg-neutral-900 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-neutral-400 uppercase tracking-widest mb-4">Current State</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-neutral-500">Active Overlay</span>
              <span className="font-mono text-yellow-400">{state?.active_overlay ?? "none"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">On Air</span>
              <span className={state?.is_live ? "text-red-400 font-semibold" : "text-neutral-500"}>
                {state?.is_live ? "YES" : "NO"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Match Status</span>
              <span className="font-mono">{STATUS_LABELS[match.status]}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Connection</span>
              <span className={online ? "text-green-400" : "text-red-400"}>{online ? "Online" : "Offline"}</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
