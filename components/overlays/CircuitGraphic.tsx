import FilmGrain from "./FilmGrain";
import { TEAMS } from "@/lib/data/teams";
import type { CircuitData, CircuitGame } from "@/lib/supabase/types";
import type { TeamCode } from "@/lib/data/teams";

const D = { fontFamily: "'Barlow Condensed', sans-serif", fontStyle: "italic" as const, textTransform: "uppercase" as const };
const L = { fontFamily: "'Inter', sans-serif", fontWeight: 600 as const, textTransform: "uppercase" as const };
const N = { fontFamily: "'Inter', sans-serif", fontVariantNumeric: "tabular-nums" as const };

function StatusBlock({ game }: { game: CircuitGame }) {
  if (game.status === "live") {
    return (
      <div style={{ width: 148, flexShrink: 0, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 20px 0 24px", gap: 4 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#00C853", animation: "livePulse 1.2s ease-in-out infinite", flexShrink: 0 }}/>
          <span style={{ ...D, fontWeight: 900, fontSize: 22, color: "#00C853", letterSpacing: "0.06em" }}>LIVE</span>
        </div>
        <span style={{ ...L, fontSize: 10, color: "#00C853", letterSpacing: "0.16em", opacity: 0.65, paddingLeft: 14 }}>
          {game.live_minute ? `LIVE ${game.live_minute}'` : "IN PROGRESS"}
        </span>
      </div>
    );
  }
  if (game.status === "ft") {
    return (
      <div style={{ width: 148, flexShrink: 0, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 20px 0 24px", gap: 4 }}>
        <span style={{ ...D, fontWeight: 700, fontSize: 22, color: "#B8923A", letterSpacing: "0.04em" }}>FULL TIME</span>
        <span style={{ ...L, fontSize: 10, color: "#555", letterSpacing: "0.16em" }}>FULL TIME</span>
      </div>
    );
  }
  return (
    <div style={{ width: 148, flexShrink: 0, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 20px 0 24px", gap: 4 }}>
      <span style={{ ...D, fontWeight: 700, fontSize: 22, color: "#444", letterSpacing: "0.04em" }}>UPCOMING</span>
      <span style={{ ...L, fontSize: 10, color: "#3A3A3A", letterSpacing: "0.16em" }}>
        {game.time ? `KICK-OFF ${game.time}` : "TBD"}
      </span>
    </div>
  );
}

function GameRow({ game, index }: { game: CircuitGame; index: number }) {
  const home = TEAMS[game.home_code as TeamCode];
  const away = TEAMS[game.away_code as TeamCode];
  const isEven = index % 2 === 0;
  const isLive = game.status === "live";
  const isFt = game.status === "ft";

  return (
    <div style={{
      display: "flex", alignItems: "center", height: 118,
      background: isLive ? "rgba(0,200,83,0.04)" : isEven ? "rgba(255,255,255,0.018)" : "transparent",
      borderBottom: "1px solid rgba(255,255,255,0.045)",
      borderLeft: isLive ? "3px solid #00C853" : "3px solid transparent",
    }}>
      {/* Status block */}
      <StatusBlock game={game} />

      {/* Thin vertical divider */}
      <div style={{ width: 1, height: "55%", background: "rgba(255,255,255,0.065)", flexShrink: 0 }}/>

      {/* Home: name → crest */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 20, paddingRight: 16 }}>
        <span style={{ ...D, fontWeight: 800, fontSize: 32, color: "#E8E6DE", letterSpacing: "-0.01em", textAlign: "right" }}>
          {home?.name || game.home_code}
        </span>
        {home && (
          <img src={home.crest} alt={home.code} style={{ width: 54, height: 54, objectFit: "contain", flexShrink: 0 }}/>
        )}
      </div>

      {/* Score / vs */}
      <div style={{ width: 168, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {(isFt || isLive) ? (
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ ...N, fontWeight: 800, fontSize: 54, color: isLive ? "#00C853" : "#B8923A", letterSpacing: "-0.02em" }}>
              {game.home_score ?? 0}
            </span>
            <span style={{ ...D, fontSize: 22, color: "#2A2A2A", fontStyle: "normal" as const }}>–</span>
            <span style={{ ...N, fontWeight: 800, fontSize: 54, color: isLive ? "#00C853" : "#B8923A", letterSpacing: "-0.02em" }}>
              {game.away_score ?? 0}
            </span>
          </div>
        ) : (
          <span style={{ ...D, fontWeight: 700, fontSize: 26, color: "#3A3A3A", letterSpacing: "0.04em" }}>VS</span>
        )}
      </div>

      {/* Away: crest → name */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 20, paddingLeft: 16 }}>
        {away && (
          <img src={away.crest} alt={away.code} style={{ width: 54, height: 54, objectFit: "contain", flexShrink: 0 }}/>
        )}
        <span style={{ ...D, fontWeight: 800, fontSize: 32, color: "#E8E6DE", letterSpacing: "-0.01em" }}>
          {away?.name || game.away_code}
        </span>
      </div>

      {/* Court label */}
      <div style={{ width: 128, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 36 }}>
        {game.court && (
          <span style={{ ...L, fontSize: 11, color: "#3A3A3A", letterSpacing: "0.18em" }}>{game.court}</span>
        )}
      </div>
    </div>
  );
}

export default function CircuitGraphic({ data }: { data: CircuitData }) {
  return (
    <div style={{
      position: "absolute", inset: 0, width: 1920, height: 1080, overflow: "hidden",
      background: "linear-gradient(160deg, #0A1230 0%, #060C1E 55%, #02060F 100%)",
      display: "flex", flexDirection: "column",
    }}>
      <style>{`@keyframes livePulse { 0%,100% { opacity:1; } 50% { opacity:0.3; } }`}</style>
      <FilmGrain />

      {/* Top gold accent */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "#B8923A" }}/>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 20% 80%, rgba(26,37,69,0.28) 0%, transparent 55%)" }}/>

      {/* Header */}
      <div style={{
        display: "flex", alignItems: "flex-start", justifyContent: "space-between",
        padding: "40px 52px 18px 52px", flexShrink: 0,
      }}>
        <div>
          {/* Subtitle line */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
            <div style={{ width: 16, height: 1, background: "rgba(184,146,58,0.5)" }}/>
            <span style={{ ...L, fontSize: 12, color: "#B8923A", letterSpacing: "0.26em" }}>
              {[data.round, data.venue].filter(Boolean).join(" · ")}
            </span>
          </div>
          {/* CIRCUIT FIXTURES split */}
          <div style={{ lineHeight: 0.92 }}>
            <span style={{ ...D, fontWeight: 900, fontSize: 72, color: "#E8E6DE", letterSpacing: "-0.02em" }}>CIRCUIT </span>
            <span style={{ ...D, fontWeight: 900, fontSize: 72, color: "#B8923A", letterSpacing: "-0.02em" }}>FIXTURES</span>
          </div>
        </div>

        {/* Right: badge + date range */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10 }}>
          <img src="/assets/mpfl-badge.png" alt="MPFL" style={{ height: 84, width: "auto", opacity: 0.9 }}/>
          {data.date_range && (
            <span style={{ ...L, fontSize: 12, color: "#444", letterSpacing: "0.16em" }}>{data.date_range}</span>
          )}
        </div>
      </div>

      {/* Gold divider */}
      <div style={{ height: 2, background: "linear-gradient(90deg, rgba(184,146,58,0.75) 0%, rgba(184,146,58,0.18) 100%)", flexShrink: 0 }}/>

      {/* Game rows */}
      <div style={{ flex: 1 }}>
        {(data.games || []).map((game, i) => <GameRow key={i} game={game} index={i} />)}
      </div>
    </div>
  );
}
