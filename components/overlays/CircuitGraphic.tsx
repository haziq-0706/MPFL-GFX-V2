import FilmGrain from "./FilmGrain";
import { TEAMS } from "@/lib/data/teams";
import type { CircuitData, CircuitGame } from "@/lib/supabase/types";
import type { TeamCode } from "@/lib/data/teams";

const D = { fontFamily: "'Barlow Condensed', sans-serif", fontStyle: "italic" as const, textTransform: "uppercase" as const };
const L = { fontFamily: "'Inter', sans-serif", fontWeight: 600, textTransform: "uppercase" as const };
const N = { fontFamily: "'Inter', sans-serif", fontVariantNumeric: "tabular-nums" as const };

function GameRow({ game, index }: { game: CircuitGame; index: number }) {
  const home = TEAMS[game.home_code as TeamCode];
  const away = TEAMS[game.away_code as TeamCode];
  const isEven = index % 2 === 0;

  return (
    <div style={{
      display: "flex", alignItems: "center",
      padding: "18px 48px",
      background: isEven ? "rgba(255,255,255,0.025)" : "transparent",
      borderBottom: "1px solid rgba(255,255,255,0.05)",
      gap: 0,
    }}>
      {/* Home team */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 16 }}>
        <span style={{ ...D, fontWeight: 800, fontSize: 36, color: "#E8E6DE", letterSpacing: "-0.01em" }}>
          {home?.name || game.home_code}
        </span>
        {home && (
          <img src={home.crest} alt={home.code} style={{ width: 48, height: 48, objectFit: "contain" }}/>
        )}
      </div>

      {/* Score / time */}
      <div style={{
        width: 180, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
        flexDirection: "column", gap: 4,
      }}>
        {game.played ? (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ ...N, fontWeight: 700, fontSize: 48, color: "#B8923A" }}>
              {game.home_score ?? 0}
            </span>
            <span style={{ ...L, fontSize: 18, color: "#333333" }}>-</span>
            <span style={{ ...N, fontWeight: 700, fontSize: 48, color: "#B8923A" }}>
              {game.away_score ?? 0}
            </span>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <span style={{ ...D, fontWeight: 700, fontSize: 28, color: "#E8E6DE", letterSpacing: "0.04em" }}>
              {game.time || "TBD"}
            </span>
            <span style={{ ...L, fontSize: 10, color: "#555555", letterSpacing: "0.16em" }}>KICK OFF</span>
          </div>
        )}
        {game.played && (
          <span style={{ ...L, fontSize: 10, color: "#555555", letterSpacing: "0.14em" }}>FULL TIME</span>
        )}
      </div>

      {/* Away team */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 16 }}>
        {away && (
          <img src={away.crest} alt={away.code} style={{ width: 48, height: 48, objectFit: "contain" }}/>
        )}
        <span style={{ ...D, fontWeight: 800, fontSize: 36, color: "#E8E6DE", letterSpacing: "-0.01em" }}>
          {away?.name || game.away_code}
        </span>
      </div>
    </div>
  );
}

export default function CircuitGraphic({ data }: { data: CircuitData }) {
  return (
    <div style={{
      position: "absolute", inset: 0, width: 1920, height: 1080, overflow: "hidden",
      background: "#0A0A0A",
    }}>
      <FilmGrain />

      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at 20% 80%, rgba(26,37,69,0.4) 0%, transparent 60%)",
      }}/>

      {/* Top accent */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "#B8923A" }}/>

      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "48px 64px 32px",
      }}>
        <div>
          <span style={{ ...L, fontSize: 12, color: "#B8923A", letterSpacing: "0.24em", display: "block", marginBottom: 6 }}>
            MALAYSIA PREMIER FUTSAL LEAGUE
          </span>
          <span style={{ ...D, fontWeight: 900, fontSize: 64, color: "#E8E6DE", letterSpacing: "-0.02em", lineHeight: 0.92 }}>
            {data.round || "Circuit Fixtures"}
          </span>
        </div>
        <img src="/assets/mpfl-badge.png" alt="MPFL" style={{ height: 80, width: "auto", opacity: 0.85 }}/>
      </div>

      {/* Divider */}
      <div style={{ height: 2, background: "linear-gradient(90deg, #B8923A 0%, rgba(184,146,58,0.2) 100%)", margin: "0 0 8px" }}/>

      {/* Games */}
      <div>
        {(data.games || []).map((game, i) => <GameRow key={i} game={game} index={i} />)}
      </div>

      {/* Bottom mpfl */}
      <div style={{ position: "absolute", bottom: 40, right: 60 }}>
        <img src="/assets/mpfl-horizontal.png" alt="MPFL" style={{ height: 24, width: "auto", opacity: 0.3 }}/>
      </div>
    </div>
  );
}
