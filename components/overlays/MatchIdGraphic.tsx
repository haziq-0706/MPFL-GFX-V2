import FilmGrain from "./FilmGrain";
import { TEAMS } from "@/lib/data/teams";
import type { MatchIdData } from "@/lib/supabase/types";
import type { TeamCode } from "@/lib/data/teams";

const D = { fontFamily: "'Barlow Condensed', sans-serif", fontStyle: "italic" as const, textTransform: "uppercase" as const };
const L = { fontFamily: "'Inter', sans-serif", fontWeight: 600 as const, textTransform: "uppercase" as const };

export default function MatchIdGraphic({ data }: { data: MatchIdData }) {
  const home = TEAMS[data.home_code as TeamCode] ?? TEAMS.JDT;
  const away = TEAMS[data.away_code as TeamCode] ?? TEAMS.SEL;

  return (
    <div style={{ position: "absolute", inset: 0, width: 1920, height: 1080, overflow: "hidden" }}>
      {/* Jagged split SVG background */}
      <img
        src="/assets/matchid-bg.svg"
        alt=""
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
      />
      <FilmGrain opacity={0.035} />

      {/* Top accent bar */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "#B8923A", zIndex: 2 }}/>

      {/* Top center: competition label + matchday */}
      <div style={{
        position: "absolute", top: 52, left: "50%", transform: "translateX(-50%)",
        zIndex: 10, textAlign: "center", whiteSpace: "nowrap",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, justifyContent: "center", marginBottom: 6 }}>
          <div style={{ width: 20, height: 1, background: "rgba(184,146,58,0.55)" }}/>
          <span style={{ ...L, fontSize: 12, color: "#B8923A", letterSpacing: "0.26em" }}>
            {data.competition || "MPFL 2026"}
          </span>
          <div style={{ width: 20, height: 1, background: "rgba(184,146,58,0.55)" }}/>
        </div>
        <span style={{ ...D, fontWeight: 900, fontSize: 40, color: "#E8E6DE", letterSpacing: "0.04em" }}>
          {data.matchday || "MATCHDAY"}
        </span>
      </div>

      {/* Center layout: HOME | MPFL BADGE | AWAY */}
      <div style={{
        position: "absolute", left: 0, right: 0, top: 0, bottom: 160,
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 5,
      }}>
        {/* Home */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>
          <img
            src={home.crest}
            alt={home.name}
            style={{ width: 192, height: 192, objectFit: "contain", filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.65))" }}
          />
          <span style={{
            ...D, fontWeight: 900, fontSize: 56, letterSpacing: "-0.02em", lineHeight: 1,
            color: "#E8E6DE", textAlign: "center", maxWidth: 600,
            textShadow: "0 4px 24px rgba(0,0,0,0.8)",
          }}>
            {home.name}
          </span>
        </div>

        {/* Center MPFL badge — acts as VS */}
        <div style={{ flexShrink: 0, width: 280, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <img
            src="/assets/mpfl-badge.png"
            alt="MPFL"
            style={{
              width: 184, height: 184, objectFit: "contain",
              filter: "drop-shadow(0 0 48px rgba(184,146,58,0.35)) drop-shadow(0 8px 24px rgba(0,0,0,0.6))",
            }}
          />
        </div>

        {/* Away */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>
          <img
            src={away.crest}
            alt={away.name}
            style={{ width: 192, height: 192, objectFit: "contain", filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.5))" }}
          />
          <span style={{
            ...D, fontWeight: 900, fontSize: 56, letterSpacing: "-0.02em", lineHeight: 1,
            color: "#E8E6DE", textAlign: "center", maxWidth: 600,
            textShadow: "0 4px 24px rgba(0,0,0,0.6)",
          }}>
            {away.name}
          </span>
        </div>
      </div>

      {/* Bottom info bar — three labeled boxes */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 160, zIndex: 15,
        background: "rgba(2,6,15,0.92)",
        borderTop: "1px solid rgba(184,146,58,0.18)",
        display: "flex", alignItems: "stretch",
      }}>
        {/* DATE */}
        <div style={{
          flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          borderRight: "1px solid rgba(255,255,255,0.07)",
        }}>
          <span style={{ ...L, fontSize: 11, color: "#444", letterSpacing: "0.26em", marginBottom: 10 }}>DATE</span>
          <span style={{ ...D, fontWeight: 800, fontSize: 42, color: "#E8E6DE", letterSpacing: "-0.01em", lineHeight: 1 }}>
            {data.match_date || "TBD"}
          </span>
        </div>

        {/* VENUE */}
        <div style={{
          flex: 2, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          borderRight: "1px solid rgba(255,255,255,0.07)", padding: "0 48px",
        }}>
          <span style={{ ...L, fontSize: 11, color: "#444", letterSpacing: "0.26em", marginBottom: 10 }}>VENUE</span>
          <span style={{
            ...D, fontWeight: 800, fontSize: 38, color: "#E8E6DE", letterSpacing: "-0.01em", lineHeight: 1,
            textAlign: "center",
          }}>
            {data.venue || "TBD"}
          </span>
        </div>

        {/* KICK-OFF */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <span style={{ ...L, fontSize: 11, color: "#444", letterSpacing: "0.26em", marginBottom: 10 }}>KICK-OFF</span>
          <span style={{ ...D, fontWeight: 900, fontSize: 48, color: "#B8923A", letterSpacing: "-0.02em", lineHeight: 1 }}>
            {data.kickoff || "TBD"}
          </span>
        </div>
      </div>
    </div>
  );
}
