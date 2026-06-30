"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Match, BroadcastState, OverlayType, StandingsRow, CircuitGame, LineupPosition } from "@/lib/supabase/types";
import { TEAMS, TEAM_LIST, DEFAULT_STANDINGS, type TeamCode } from "@/lib/data/teams";
import CountdownGraphic from "@/components/overlays/CountdownGraphic";
import MatchIdGraphic from "@/components/overlays/MatchIdGraphic";
import StandingsGraphic from "@/components/overlays/StandingsGraphic";
import CircuitGraphic from "@/components/overlays/CircuitGraphic";
import LineupGraphic from "@/components/overlays/LineupGraphic";

const supabase = createClient();
const SCALE = 560 / 1920;
const PVW_H = Math.round(1080 * SCALE);

function MonitorPreview({ children, label, live }: { children: React.ReactNode; label: string; live?: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.14em", color: live ? "#ef4444" : "#555", fontFamily: "'Inter', sans-serif" }}>
          {label}
        </span>
        {live && (
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)",
            padding: "1px 8px", fontSize: 10, fontWeight: 700, letterSpacing: "0.2em",
            color: "#ef4444", fontFamily: "'Inter', sans-serif",
          }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#ef4444", animation: "livePulse 1.2s ease-in-out infinite", display: "inline-block" }}/>
            ON AIR
          </span>
        )}
      </div>
      <div style={{
        width: 560, height: PVW_H, position: "relative", overflow: "hidden",
        background: "#000",
        border: `2px solid ${live ? "rgba(239,68,68,0.6)" : "#1A1A1A"}`,
        boxShadow: live ? "0 0 0 1px rgba(239,68,68,0.2), 0 8px 32px rgba(0,0,0,0.8)" : "0 4px 24px rgba(0,0,0,0.6)",
      }}>
        <div style={{ width: 1920, height: 1080, transform: `scale(${SCALE})`, transformOrigin: "top left", position: "absolute", top: 0, left: 0 }}>
          {children}
        </div>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 50%)" }}/>
      </div>
    </div>
  );
}

function TypeBtn({ id, label, active, onClick }: { id: OverlayType; label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      flex: 1, padding: "10px 0", fontSize: 11, fontWeight: 700, fontFamily: "'Inter', sans-serif",
      textTransform: "uppercase", letterSpacing: "0.1em", cursor: "pointer",
      background: active ? "#B8923A" : "#111", color: active ? "#0A0A0A" : "#555",
      border: `1px solid ${active ? "#B8923A" : "#1A1A1A"}`,
    }}>
      {label}
    </button>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", background: "#111", border: "1px solid #1A1A1A", color: "#E8E6DE",
  padding: "8px 12px", fontSize: 13, fontFamily: "'Inter', sans-serif", boxSizing: "border-box",
};
const labelStyle: React.CSSProperties = {
  fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em",
  color: "#555", display: "block", marginBottom: 4, fontFamily: "'Inter', sans-serif",
};
const selectStyle: React.CSSProperties = { ...inputStyle, cursor: "pointer" };

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <span style={labelStyle}>{label}</span>
      {children}
    </div>
  );
}

const LINEUP_POSITIONS: LineupPosition[] = ["GK", "ALA", "FIXO", "PIVO", "COACH"];

export default function ControlPage() {
  const [liveState, setLiveState] = useState<BroadcastState | null>(null);
  const [match, setMatch] = useState<Match | null>(null);
  const [online, setOnline] = useState(true);
  const [saving, setSaving] = useState(false);

  const [cueOverlay, setCueOverlay] = useState<OverlayType>("countdown");

  // Match setup
  const [homeCode, setHomeCode] = useState<TeamCode>("JDT");
  const [awayCode, setAwayCode] = useState<TeamCode>("SEL");
  const [competition, setCompetition] = useState("MPFL 2026 · CIRCUIT 1");
  const [venue, setVenue] = useState("");
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [matchTime, setMatchTime] = useState("00:00");
  const [matchStatus, setMatchStatus] = useState<Match["status"]>("pre");

  // Countdown
  const [cdMins, setCdMins] = useState(15);
  const [cdSecs, setCdSecs] = useState(0);
  const [cdMatchDate, setCdMatchDate] = useState("");       // e.g. "SAT 14 FEB"
  const [cdKickoffTime, setCdKickoffTime] = useState("");   // e.g. "20:00 MYT"

  // Match ID
  const [matchday, setMatchday] = useState("MATCHDAY");
  const [kickoff, setKickoff] = useState("14:00");
  const [matchDate, setMatchDate] = useState("");

  // Table
  const [tableTitle, setTableTitle] = useState("STANDINGS");
  const [tableSeason, setTableSeason] = useState("MPFL 2026 · LEAGUE");
  const [tableRows, setTableRows] = useState<StandingsRow[]>(
    DEFAULT_STANDINGS.map(r => ({ ...r, form: r.form as import("@/lib/supabase/types").FormResult[] }))
  );

  // Circuit
  const [circuitRound, setCircuitRound] = useState("CIRCUIT 1");
  const [circuitVenue, setCircuitVenue] = useState("");
  const [circuitDateRange, setCircuitDateRange] = useState("");
  const [circuitGames, setCircuitGames] = useState<CircuitGame[]>([
    { home_code: "JDT", away_code: "SEL", status: "upcoming", time: "14:00", court: "COURT A" },
    { home_code: "PAH", away_code: "KLC", status: "upcoming", time: "16:00", court: "COURT A" },
    { home_code: "PFA", away_code: "ATM", status: "upcoming", time: "18:00", court: "COURT B" },
  ]);

  // Starting Five
  const [lineupTeam, setLineupTeam] = useState<TeamCode>("JDT");
  const [lineupPlayers, setLineupPlayers] = useState([
    { number: "1",  name: "", position: "GK"   as LineupPosition },
    { number: "7",  name: "", position: "ALA"  as LineupPosition },
    { number: "10", name: "", position: "ALA"  as LineupPosition },
    { number: "11", name: "", position: "PIVO" as LineupPosition },
    { number: "14", name: "", position: "FIXO" as LineupPosition },
  ]);
  const [lineupRevealed, setLineupRevealed] = useState(0);

  const load = useCallback(async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabase as any;
    const { data: stateData } = await db.from("broadcast_state").select("*").eq("id", "main").single();
    if (stateData) {
      setLiveState(stateData as BroadcastState);
      if ((stateData as BroadcastState).match_id) {
        const { data: matchData } = await db.from("matches").select("*").eq("id", (stateData as BroadcastState).match_id).single();
        if (matchData) {
          const m = matchData as Match;
          setMatch(m);
          if (m.home_team && TEAMS[m.home_team as TeamCode]) setHomeCode(m.home_team as TeamCode);
          if (m.away_team && TEAMS[m.away_team as TeamCode]) setAwayCode(m.away_team as TeamCode);
          setHomeScore(m.home_score);
          setAwayScore(m.away_score);
          setMatchTime(m.match_time);
          setMatchStatus(m.status);
          if (m.venue) setVenue(m.venue);
          if (m.competition) setCompetition(m.competition);
        }
      }
    }
  }, []);

  useEffect(() => {
    load();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const channel = (supabase as any).channel("control-v2")
      .on("postgres_changes", { event: "*", schema: "public", table: "broadcast_state" },
        (p: { new: unknown }) => setLiveState(p.new as BroadcastState))
      .on("postgres_changes", { event: "*", schema: "public", table: "matches" },
        (p: { new: unknown }) => {
          const m = p.new as Match;
          setMatch(m); setHomeScore(m.home_score); setAwayScore(m.away_score);
          setMatchTime(m.match_time); setMatchStatus(m.status);
        })
      .subscribe();
    window.addEventListener("online", () => setOnline(true));
    window.addEventListener("offline", () => setOnline(false));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return () => { (supabase as any).removeChannel(channel); };
  }, [load]);

  async function saveMatch() {
    setSaving(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabase as any;
    const payload = {
      home_team: homeCode, away_team: awayCode,
      home_score: homeScore, away_score: awayScore,
      match_time: matchTime, status: matchStatus,
      venue: venue || null, competition: competition || null,
    };
    try {
      if (match?.id) {
        await db.from("matches").update(payload).eq("id", match.id);
      } else {
        const { data } = await db.from("matches").insert(payload).select().single();
        if (data) {
          setMatch(data as Match);
          await db.from("broadcast_state").update({ match_id: (data as Match).id }).eq("id", "main");
        }
      }
    } finally { setSaving(false); }
  }

  async function adjustScore(team: "home" | "away", delta: number) {
    const field = team === "home" ? "home_score" : "away_score";
    const cur = team === "home" ? homeScore : awayScore;
    const next = Math.max(0, cur + delta);
    if (team === "home") setHomeScore(next); else setAwayScore(next);
    if (match?.id) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any).from("matches").update({ [field]: next }).eq("id", match.id);
    }
  }

  function buildOverlayData(): Record<string, unknown> {
    switch (cueOverlay) {
      case "countdown":
        return {
          target_time: Date.now() + (cdMins * 60 + cdSecs) * 1000,
          label: "KICK-OFF IN",
          home_code: homeCode,
          away_code: awayCode,
          home_team: TEAMS[homeCode]?.name,
          away_team: TEAMS[awayCode]?.name,
          competition, venue,
          match_date: cdMatchDate || undefined,
          kickoff_time: cdKickoffTime || undefined,
        };
      case "matchid":
        return {
          home_code: homeCode, away_code: awayCode,
          competition, matchday, venue,
          match_date: matchDate || undefined,
          kickoff: kickoff || undefined,
        };
      case "table":
        return { title: tableTitle, season: tableSeason, rows: tableRows };
      case "circuit":
        return {
          round: circuitRound,
          venue: circuitVenue || undefined,
          date_range: circuitDateRange || undefined,
          games: circuitGames,
        };
      case "lineup":
        return { team_code: lineupTeam, players: lineupPlayers, revealed: lineupRevealed };
      default:
        return {};
    }
  }

  async function take() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabase as any;
    await db.from("broadcast_state").update({
      active_overlay: cueOverlay,
      overlay_data: buildOverlayData(),
      is_live: true,
      match_id: match?.id ?? null,
    }).eq("id", "main");
  }

  async function out() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).from("broadcast_state").update({
      active_overlay: null, is_live: false,
    }).eq("id", "main");
  }

  async function revealNext() {
    const next = Math.min(5, lineupRevealed + 1);
    setLineupRevealed(next);
    if (liveState?.is_live && liveState.active_overlay === "lineup") {
      const newData = { ...liveState.overlay_data, revealed: next };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any).from("broadcast_state").update({ overlay_data: newData }).eq("id", "main");
    }
  }

  function PreviewGraphic() {
    const previewData = buildOverlayData();
    switch (cueOverlay) {
      case "countdown":
        return <CountdownGraphic data={{ ...previewData as unknown as import("@/lib/supabase/types").CountdownData, target_time: Date.now() + (cdMins * 60 + cdSecs) * 1000 }} />;
      case "matchid":
        return <MatchIdGraphic data={previewData as unknown as import("@/lib/supabase/types").MatchIdData} />;
      case "table":
        return <StandingsGraphic data={previewData as unknown as import("@/lib/supabase/types").TableData} />;
      case "circuit":
        return <CircuitGraphic data={previewData as unknown as import("@/lib/supabase/types").CircuitData} />;
      case "lineup":
        return <LineupGraphic data={previewData as unknown as import("@/lib/supabase/types").LineupData} />;
      default:
        return (
          <div style={{ width: 1920, height: 1080, background: "#060C1E", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#222", fontFamily: "'Inter', sans-serif", fontSize: 24 }}>Select a graphic type</span>
          </div>
        );
    }
  }

  function LiveGraphic() {
    if (!liveState?.is_live || !liveState.active_overlay) {
      return (
        <div style={{ width: 1920, height: 1080, background: "#060C1E", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: "#1A1A1A", fontFamily: "'Inter', sans-serif", fontSize: 20 }}>OFF AIR</span>
        </div>
      );
    }
    const d = liveState.overlay_data || {};
    switch (liveState.active_overlay) {
      case "countdown": return <CountdownGraphic data={d as unknown as import("@/lib/supabase/types").CountdownData} />;
      case "matchid":   return <MatchIdGraphic data={d as unknown as import("@/lib/supabase/types").MatchIdData} />;
      case "table":     return <StandingsGraphic data={d as unknown as import("@/lib/supabase/types").TableData} />;
      case "circuit":   return <CircuitGraphic data={d as unknown as import("@/lib/supabase/types").CircuitData} />;
      case "lineup":    return <LineupGraphic data={d as unknown as import("@/lib/supabase/types").LineupData} />;
      default:          return null;
    }
  }

  const isLive = liveState?.is_live && liveState.active_overlay !== null;

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0A", color: "#E8E6DE", fontFamily: "'Inter', sans-serif", padding: 0, margin: 0 }}>
      <style>{`
        @keyframes livePulse { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }
        * { box-sizing: border-box; }
        input, select, button { outline: none; }
        input:focus, select:focus { border-color: #B8923A !important; }
        button:hover { opacity: 0.85; }
      `}</style>

      {/* Header */}
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 32px", background: "#000", borderBottom: "2px solid #1A1A1A" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <img src="/assets/mpfl-badge.png" alt="MPFL" style={{ height: 34, width: "auto" }}/>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: "0.04em", fontFamily: "'Barlow Condensed', sans-serif", fontStyle: "italic", textTransform: "uppercase" }}>
              BROADCAST CONTROL
            </div>
            <div style={{ fontSize: 11, color: "#555", letterSpacing: "0.1em" }}>{competition || "MPFL Broadcast Graphics"}</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {!online && <span style={{ background: "#dc2626", color: "#fff", fontSize: 10, padding: "2px 8px", fontWeight: 700, letterSpacing: "0.12em" }}>OFFLINE</span>}
          <a href="/output" target="_blank" style={{ fontSize: 11, color: "#555", textDecoration: "none", padding: "6px 12px", border: "1px solid #1A1A1A", letterSpacing: "0.1em" }}>
            OUTPUT ↗
          </a>
          <div style={{ padding: "6px 16px", fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", background: isLive ? "rgba(239,68,68,0.15)" : "#111", border: `1px solid ${isLive ? "rgba(239,68,68,0.4)" : "#1A1A1A"}`, color: isLive ? "#ef4444" : "#555" }}>
            {isLive ? "● ON AIR" : "OFF AIR"}
          </div>
        </div>
      </header>

      {/* Score strip */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 24, padding: "10px 32px", background: "#000", borderBottom: "1px solid #1A1A1A" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img src={TEAMS[homeCode]?.crest} alt="" style={{ width: 26, height: 26, objectFit: "contain" }}/>
          <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontStyle: "italic", fontWeight: 800, fontSize: 17, textTransform: "uppercase" }}>{TEAMS[homeCode]?.short}</span>
          <button onClick={() => adjustScore("home", -1)} style={{ width: 26, height: 26, background: "#111", border: "1px solid #1A1A1A", color: "#E8E6DE", cursor: "pointer", fontSize: 14, fontWeight: 700 }}>−</button>
          <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontStyle: "italic", fontWeight: 900, fontSize: 30, color: "#B8923A", letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums", minWidth: 36, textAlign: "center" }}>{homeScore}</span>
          <button onClick={() => adjustScore("home", 1)} style={{ width: 26, height: 26, background: "#B8923A", border: "1px solid #B8923A", color: "#0A0A0A", cursor: "pointer", fontSize: 14, fontWeight: 700 }}>+</button>
        </div>
        <span style={{ color: "#333", fontWeight: 700, fontSize: 18 }}>:</span>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={() => adjustScore("away", -1)} style={{ width: 26, height: 26, background: "#111", border: "1px solid #1A1A1A", color: "#E8E6DE", cursor: "pointer", fontSize: 14, fontWeight: 700 }}>−</button>
          <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontStyle: "italic", fontWeight: 900, fontSize: 30, color: "#B8923A", letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums", minWidth: 36, textAlign: "center" }}>{awayScore}</span>
          <button onClick={() => adjustScore("away", 1)} style={{ width: 26, height: 26, background: "#B8923A", border: "1px solid #B8923A", color: "#0A0A0A", cursor: "pointer", fontSize: 14, fontWeight: 700 }}>+</button>
          <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontStyle: "italic", fontWeight: 800, fontSize: 17, textTransform: "uppercase" }}>{TEAMS[awayCode]?.short}</span>
          <img src={TEAMS[awayCode]?.crest} alt="" style={{ width: 26, height: 26, objectFit: "contain" }}/>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: 20 }}>
          <select value={matchStatus} onChange={e => setMatchStatus(e.target.value as Match["status"])} style={{ ...selectStyle, width: 110 }}>
            <option value="pre">Pre-Match</option>
            <option value="live">Live</option>
            <option value="ht">Half Time</option>
            <option value="ft">Full Time</option>
          </select>
          <input value={matchTime} onChange={e => setMatchTime(e.target.value)} style={{ ...inputStyle, width: 64 }} placeholder="00:00"/>
        </div>
      </div>

      {/* Main */}
      <div style={{ padding: "24px 32px", display: "flex", gap: 28, alignItems: "flex-start" }}>

        {/* Left: monitors + controls */}
        <div style={{ flex: "0 0 auto" }}>

          {/* Monitor row */}
          <div style={{ display: "flex", gap: 20, marginBottom: 16, alignItems: "center" }}>
            <MonitorPreview label="Preview" live={false}>
              <PreviewGraphic />
            </MonitorPreview>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
              <button onClick={take} style={{
                width: 84, padding: "14px 0",
                background: "#B8923A", border: "none", color: "#0A0A0A",
                fontFamily: "'Barlow Condensed', sans-serif", fontStyle: "italic",
                fontWeight: 900, fontSize: 20, letterSpacing: "0.04em", textTransform: "uppercase",
                cursor: "pointer",
              }}>TAKE ▶</button>
              <button onClick={out} style={{
                width: 84, padding: "14px 0",
                background: "transparent", border: "2px solid #dc2626", color: "#dc2626",
                fontFamily: "'Barlow Condensed', sans-serif", fontStyle: "italic",
                fontWeight: 900, fontSize: 20, letterSpacing: "0.04em", textTransform: "uppercase",
                cursor: "pointer",
              }}>◀ OUT</button>
            </div>

            <MonitorPreview label="Output" live={isLive}>
              <LiveGraphic />
            </MonitorPreview>
          </div>

          {/* Graphic type tabs */}
          <div style={{ display: "flex", gap: 0, marginBottom: 16 }}>
            {([
              { id: "countdown", label: "Countdown"     },
              { id: "matchid",   label: "Match ID"      },
              { id: "table",     label: "Standings"     },
              { id: "circuit",   label: "Circuit Games" },
              { id: "lineup",    label: "Starting Five" },
            ] as const).map(t => (
              <TypeBtn key={t.id} id={t.id} label={t.label} active={cueOverlay === t.id} onClick={() => setCueOverlay(t.id)} />
            ))}
          </div>

          {/* Data panel */}
          <div style={{ background: "#111", border: "1px solid #1A1A1A", padding: 20, width: 1160 }}>

            {/* COUNTDOWN */}
            {cueOverlay === "countdown" && (
              <div>
                <div style={{ display: "grid", gridTemplateColumns: "80px 80px 1fr 1fr 1fr", gap: 12, marginBottom: 8 }}>
                  <Field label="Min">
                    <input type="number" value={cdMins} min={0} max={99} onChange={e => setCdMins(+e.target.value)} style={inputStyle}/>
                  </Field>
                  <Field label="Sec">
                    <input type="number" value={cdSecs} min={0} max={59} onChange={e => setCdSecs(+e.target.value)} style={inputStyle}/>
                  </Field>
                  <Field label="Match Date">
                    <input value={cdMatchDate} onChange={e => setCdMatchDate(e.target.value)} style={inputStyle} placeholder="SAT 14 FEB"/>
                  </Field>
                  <Field label="Kickoff Time">
                    <input value={cdKickoffTime} onChange={e => setCdKickoffTime(e.target.value)} style={inputStyle} placeholder="20:00 MYT"/>
                  </Field>
                  <Field label="Venue">
                    <input value={venue} onChange={e => setVenue(e.target.value)} style={inputStyle} placeholder="Arena name"/>
                  </Field>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => setCdSecs(prev => { const t = cdMins * 60 + prev - 10; return Math.max(0, t) % 60 || (setCdMins(Math.max(0, Math.floor(Math.max(0, t) / 60))), Math.max(0, t) % 60); })}
                    style={{ padding: "6px 12px", background: "#111", border: "1px solid #1A1A1A", color: "#E8E6DE", cursor: "pointer", fontSize: 12 }}>-10s</button>
                  <button onClick={() => { const t = cdMins * 60 + cdSecs + 10; setCdMins(Math.floor(t/60)); setCdSecs(t%60); }}
                    style={{ padding: "6px 12px", background: "#111", border: "1px solid #1A1A1A", color: "#E8E6DE", cursor: "pointer", fontSize: 12 }}>+10s</button>
                  <button onClick={() => { setCdMins(prev => Math.max(0, prev - 1)); }}
                    style={{ padding: "6px 12px", background: "#111", border: "1px solid #1A1A1A", color: "#E8E6DE", cursor: "pointer", fontSize: 12 }}>-1m</button>
                  <button onClick={() => { setCdMins(prev => prev + 1); }}
                    style={{ padding: "6px 12px", background: "#111", border: "1px solid #1A1A1A", color: "#E8E6DE", cursor: "pointer", fontSize: 12 }}>+1m</button>
                  <button onClick={() => { setCdMins(15); setCdSecs(0); }}
                    style={{ padding: "6px 12px", background: "#111", border: "1px solid #1A1A1A", color: "#555", cursor: "pointer", fontSize: 12 }}>RESET</button>
                </div>
              </div>
            )}

            {/* MATCH ID */}
            {cueOverlay === "matchid" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr", gap: 12 }}>
                <Field label="Home Team">
                  <select value={homeCode} onChange={e => setHomeCode(e.target.value as TeamCode)} style={selectStyle}>
                    {TEAM_LIST.map(t => <option key={t.code} value={t.code}>{t.name}</option>)}
                  </select>
                </Field>
                <Field label="Away Team">
                  <select value={awayCode} onChange={e => setAwayCode(e.target.value as TeamCode)} style={selectStyle}>
                    {TEAM_LIST.map(t => <option key={t.code} value={t.code}>{t.name}</option>)}
                  </select>
                </Field>
                <Field label="Competition">
                  <input value={competition} onChange={e => setCompetition(e.target.value)} style={inputStyle} placeholder="MPFL 2026 · CIRCUIT 3"/>
                </Field>
                <Field label="Matchday">
                  <input value={matchday} onChange={e => setMatchday(e.target.value)} style={inputStyle} placeholder="MATCHDAY"/>
                </Field>
                <Field label="Venue">
                  <input value={venue} onChange={e => setVenue(e.target.value)} style={inputStyle} placeholder="Axiata Arena"/>
                </Field>
                <Field label="Match Date">
                  <input value={matchDate} onChange={e => setMatchDate(e.target.value)} style={inputStyle} placeholder="SAT 14 FEB"/>
                </Field>
                <Field label="Kick Off">
                  <input value={kickoff} onChange={e => setKickoff(e.target.value)} style={inputStyle} placeholder="20:00 MYT"/>
                </Field>
              </div>
            )}

            {/* TABLE */}
            {cueOverlay === "table" && (
              <div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                  <Field label="Season Label">
                    <input value={tableSeason} onChange={e => setTableSeason(e.target.value)} style={inputStyle} placeholder="MPFL 2026 · LEAGUE"/>
                  </Field>
                  <Field label="Title Word">
                    <input value={tableTitle} onChange={e => setTableTitle(e.target.value)} style={inputStyle} placeholder="STANDINGS"/>
                  </Field>
                </div>
                <div style={{ fontSize: 11, color: "#555", marginBottom: 6, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em" }}>
                  Standings — edit Pts to auto-sort
                </div>
                <div style={{ maxHeight: 240, overflowY: "auto" }}>
                  {tableRows.map((row, i) => (
                    <div key={row.code} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                      <span style={{ width: 20, color: "#555", fontSize: 12, textAlign: "center" }}>{i+1}</span>
                      <img src={TEAMS[row.code as TeamCode]?.crest} alt="" style={{ width: 18, height: 18, objectFit: "contain" }}/>
                      <span style={{ width: 140, fontSize: 12, color: "#E8E6DE", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{row.name}</span>
                      {(["p","w","d","l","gf","ga","gd","pts"] as const).map(f => (
                        <input
                          key={f}
                          type="number"
                          value={row[f as keyof StandingsRow] as number ?? 0}
                          onChange={e => {
                            const v = +e.target.value;
                            setTableRows(prev => {
                              const next = prev.map((r, j) => j === i ? { ...r, [f]: v } : r);
                              if (f === "pts") {
                                next.sort((a, b) => b.pts - a.pts || b.gd - a.gd);
                                return next.map((r, j) => ({ ...r, pos: j + 1 }));
                              }
                              return next;
                            });
                          }}
                          style={{ ...inputStyle, width: 40, padding: "3px 4px", textAlign: "center", fontSize: 12 }}
                          title={f.toUpperCase()}
                        />
                      ))}
                      <span style={{ fontSize: 10, color: "#333", width: 52 }}>{["P","W","D","L","GF","GA","GD","PTS"].join(" ")}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CIRCUIT */}
            {cueOverlay === "circuit" && (
              <div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: 12, marginBottom: 14 }}>
                  <Field label="Round">
                    <input value={circuitRound} onChange={e => setCircuitRound(e.target.value)} style={inputStyle} placeholder="CIRCUIT 3"/>
                  </Field>
                  <Field label="Venue">
                    <input value={circuitVenue} onChange={e => setCircuitVenue(e.target.value)} style={inputStyle} placeholder="Axiata Arena, KL"/>
                  </Field>
                  <Field label="Date Range">
                    <input value={circuitDateRange} onChange={e => setCircuitDateRange(e.target.value)} style={inputStyle} placeholder="SAT-SUN · 14-15 FEB 2026"/>
                  </Field>
                  <div style={{ display: "flex", alignItems: "flex-end" }}>
                    <button
                      onClick={() => setCircuitGames(prev => [...prev, { home_code: "JDT", away_code: "SEL", status: "upcoming", time: "14:00", court: "COURT A" }])}
                      style={{ padding: "8px 12px", background: "#111", border: "1px solid #1A1A1A", color: "#B8923A", cursor: "pointer", fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", whiteSpace: "nowrap" }}
                    >
                      + Add
                    </button>
                  </div>
                </div>
                <div style={{ maxHeight: 200, overflowY: "auto" }}>
                  {circuitGames.map((g, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                      <select value={g.status} onChange={e => setCircuitGames(prev => prev.map((x, j) => j === i ? { ...x, status: e.target.value as CircuitGame["status"] } : x))} style={{ ...selectStyle, width: 100 }}>
                        <option value="upcoming">Upcoming</option>
                        <option value="live">Live</option>
                        <option value="ft">Full Time</option>
                      </select>
                      <select value={g.home_code} onChange={e => setCircuitGames(prev => prev.map((x, j) => j === i ? { ...x, home_code: e.target.value } : x))} style={{ ...selectStyle, width: 60 }}>
                        {TEAM_LIST.map(t => <option key={t.code} value={t.code}>{t.code}</option>)}
                      </select>
                      <input type="number" placeholder="H" value={g.home_score ?? ""} onChange={e => setCircuitGames(prev => prev.map((x, j) => j === i ? { ...x, home_score: e.target.value ? +e.target.value : undefined } : x))} style={{ ...inputStyle, width: 40, textAlign: "center", padding: "8px 4px" }}/>
                      <span style={{ color: "#333" }}>-</span>
                      <input type="number" placeholder="A" value={g.away_score ?? ""} onChange={e => setCircuitGames(prev => prev.map((x, j) => j === i ? { ...x, away_score: e.target.value ? +e.target.value : undefined } : x))} style={{ ...inputStyle, width: 40, textAlign: "center", padding: "8px 4px" }}/>
                      <select value={g.away_code} onChange={e => setCircuitGames(prev => prev.map((x, j) => j === i ? { ...x, away_code: e.target.value } : x))} style={{ ...selectStyle, width: 60 }}>
                        {TEAM_LIST.map(t => <option key={t.code} value={t.code}>{t.code}</option>)}
                      </select>
                      <input placeholder="Time" value={g.time ?? ""} onChange={e => setCircuitGames(prev => prev.map((x, j) => j === i ? { ...x, time: e.target.value } : x))} style={{ ...inputStyle, width: 60 }} title="Kickoff / live minute"/>
                      <input placeholder="Min" value={g.live_minute ?? ""} onChange={e => setCircuitGames(prev => prev.map((x, j) => j === i ? { ...x, live_minute: e.target.value } : x))} style={{ ...inputStyle, width: 44 }} title="Live minute"/>
                      <input placeholder="Court" value={g.court ?? ""} onChange={e => setCircuitGames(prev => prev.map((x, j) => j === i ? { ...x, court: e.target.value } : x))} style={{ ...inputStyle, width: 80 }} title="Court A / B"/>
                      <button onClick={() => setCircuitGames(prev => prev.filter((_, j) => j !== i))} style={{ background: "transparent", border: "1px solid #333", color: "#555", padding: "4px 8px", cursor: "pointer", fontSize: 12 }}>✕</button>
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: 10, color: "#333", marginTop: 6 }}>Status · Home · H score – A score · Away · Time · Live min · Court</div>
              </div>
            )}

            {/* STARTING FIVE */}
            {cueOverlay === "lineup" && (
              <div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto auto auto", gap: 12, alignItems: "flex-end", marginBottom: 14 }}>
                  <Field label="Team">
                    <select value={lineupTeam} onChange={e => setLineupTeam(e.target.value as TeamCode)} style={selectStyle}>
                      {TEAM_LIST.map(t => <option key={t.code} value={t.code}>{t.name}</option>)}
                    </select>
                  </Field>
                  <button
                    onClick={revealNext}
                    disabled={lineupRevealed >= 5}
                    style={{
                      padding: "8px 16px", background: lineupRevealed < 5 ? "#B8923A" : "#111",
                      border: "1px solid #B8923A", color: lineupRevealed < 5 ? "#0A0A0A" : "#555",
                      cursor: lineupRevealed < 5 ? "pointer" : "default",
                      fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", whiteSpace: "nowrap",
                    }}
                  >
                    Reveal ▶ ({lineupRevealed}/5)
                  </button>
                  <button
                    onClick={async () => {
                      setLineupRevealed(5);
                      if (liveState?.is_live && liveState.active_overlay === "lineup") {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        await (supabase as any).from("broadcast_state").update({ overlay_data: { ...liveState.overlay_data, revealed: 5 } }).eq("id", "main");
                      }
                    }}
                    style={{ padding: "8px 12px", background: "transparent", border: "1px solid #1A1A1A", color: "#777", cursor: "pointer", fontSize: 12 }}
                  >
                    All
                  </button>
                  <button onClick={() => setLineupRevealed(0)} style={{ padding: "8px 12px", background: "transparent", border: "1px solid #1A1A1A", color: "#555", cursor: "pointer", fontSize: 12 }}>Reset</button>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  {lineupPlayers.map((p, i) => (
                    <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <span style={{ fontSize: 11, color: i < lineupRevealed ? "#B8923A" : "#333", fontWeight: 700, width: 16, textAlign: "center" }}>
                          {i < lineupRevealed ? "✓" : String(i + 1)}
                        </span>
                        <span style={{ fontSize: 11, color: "#444", letterSpacing: "0.1em", textTransform: "uppercase" }}>Player {i+1}</span>
                      </div>
                      <select
                        value={p.position || "ALA"}
                        onChange={e => setLineupPlayers(prev => prev.map((x, j) => j === i ? { ...x, position: e.target.value as LineupPosition } : x))}
                        style={{ ...selectStyle, padding: "5px 8px", fontSize: 11 }}
                      >
                        {LINEUP_POSITIONS.map(pos => <option key={pos} value={pos}>{pos}</option>)}
                      </select>
                      <input
                        value={p.number}
                        onChange={e => setLineupPlayers(prev => prev.map((x, j) => j === i ? { ...x, number: e.target.value } : x))}
                        style={{ ...inputStyle, padding: "5px 8px", textAlign: "center", fontSize: 13 }}
                        placeholder="#"
                      />
                      <input
                        value={p.name}
                        onChange={e => setLineupPlayers(prev => prev.map((x, j) => j === i ? { ...x, name: e.target.value } : x))}
                        style={{ ...inputStyle, padding: "5px 8px", textTransform: "uppercase", fontSize: 12 }}
                        placeholder="Player name"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Match Setup */}
        <div style={{ flex: 1, minWidth: 260, maxWidth: 320 }}>
          <div style={{ background: "#111", border: "1px solid #1A1A1A", padding: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.16em", color: "#555", marginBottom: 14 }}>
              Match Setup
            </div>

            <Field label="Home Team">
              <select value={homeCode} onChange={e => setHomeCode(e.target.value as TeamCode)} style={selectStyle}>
                {TEAM_LIST.map(t => <option key={t.code} value={t.code}>{t.name}</option>)}
              </select>
            </Field>

            <Field label="Away Team">
              <select value={awayCode} onChange={e => setAwayCode(e.target.value as TeamCode)} style={selectStyle}>
                {TEAM_LIST.map(t => <option key={t.code} value={t.code}>{t.name}</option>)}
              </select>
            </Field>

            <Field label="Competition">
              <input value={competition} onChange={e => setCompetition(e.target.value)} style={inputStyle} placeholder="MPFL 2026 · CIRCUIT 1"/>
            </Field>

            <Field label="Venue">
              <input value={venue} onChange={e => setVenue(e.target.value)} style={inputStyle} placeholder="Stadium name"/>
            </Field>

            <button onClick={saveMatch} disabled={saving} style={{
              width: "100%", padding: "10px 0", marginTop: 8,
              background: "#B8923A", border: "none", color: "#0A0A0A",
              fontFamily: "'Barlow Condensed', sans-serif", fontStyle: "italic",
              fontWeight: 900, fontSize: 16, letterSpacing: "0.06em", textTransform: "uppercase",
              cursor: saving ? "default" : "pointer", opacity: saving ? 0.6 : 1,
            }}>
              {saving ? "Saving..." : match?.id ? "Update Match" : "Create Match"}
            </button>

            <div style={{ marginTop: 18, paddingTop: 14, borderTop: "1px solid #1A1A1A" }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.16em", color: "#555", marginBottom: 10 }}>Live State</div>
              {([
                ["Overlay", liveState?.active_overlay ?? "none"],
                ["On Air", liveState?.is_live ? "YES" : "NO"],
                ["Match ID", match?.id?.slice(0, 8) ?? "–"],
                ["Connection", online ? "Online" : "Offline"],
              ] as const).map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, fontSize: 12 }}>
                  <span style={{ color: "#555" }}>{k}</span>
                  <span style={{
                    color: k === "On Air" && v === "YES" ? "#ef4444" : k === "Connection" && v === "Offline" ? "#ef4444" : "#B8923A",
                    fontFamily: "'Barlow Condensed', sans-serif", fontStyle: "italic", fontWeight: 700,
                  }}>{v as string}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
