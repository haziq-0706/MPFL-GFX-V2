import FilmGrain from "./FilmGrain";
import { TEAMS } from "@/lib/data/teams";
import type { MatchIdData } from "@/lib/supabase/types";
import type { TeamCode } from "@/lib/data/teams";

const D = { fontFamily: "'Barlow Condensed', sans-serif", fontStyle: "italic" as const, textTransform: "uppercase" as const };
const L = { fontFamily: "'Inter', sans-serif", fontWeight: 600, textTransform: "uppercase" as const };

export default function MatchIdGraphic({ data }: { data: MatchIdData }) {
  const home = TEAMS[data.home_code as TeamCode] ?? TEAMS.JDT;
  const away = TEAMS[data.away_code as TeamCode] ?? TEAMS.SEL;

  return (
    <div style={{ position: "absolute", inset: 0, width: 1920, height: 1080, overflow: "hidden" }}>
      {/* SVG background */}
      <img
        src="/assets/matchid-bg.svg"
        alt=""
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
      />
      <FilmGrain opacity={0.035} />

      {/* Top accent bar */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "#B8923A", zIndex: 2 }}/>

      {/* MPFL badge top center */}
      <div style={{ position: "absolute", top: 48, left: "50%", transform: "translateX(-50%)", zIndex: 10 }}>
        <img src="/assets/mpfl-badge.png" alt="MPFL" style={{ height: 80, width: "auto" }}/>
      </div>

      {/* Competition label */}
      <div style={{ position: "absolute", top: 152, left: "50%", transform: "translateX(-50%)", zIndex: 10, textAlign: "center" }}>
        <span style={{ ...L, fontSize: 13, color: "#B8923A", letterSpacing: "0.2em" }}>
          {data.competition || "MALAYSIA PREMIER FUTSAL LEAGUE"}
        </span>
      </div>

      {/* HOME TEAM — left half */}
      <div style={{
        position: "absolute", left: 0, top: 0, width: 900, height: 1080,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        gap: 32, zIndex: 5,
      }}>
        <img
          src={home.crest}
          alt={home.name}
          style={{ width: 280, height: 280, objectFit: "contain", filter: "drop-shadow(0 16px 40px rgba(0,0,0,0.6))" }}
        />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <span style={{
            ...D, fontWeight: 900, fontSize: 72, letterSpacing: "-0.02em", lineHeight: 0.92,
            color: "#E8E6DE", textAlign: "center", maxWidth: 700,
            textShadow: "0 4px 20px rgba(0,0,0,0.5)",
          }}>
            {home.name}
          </span>
          <div style={{ width: 80, height: 3, background: home.primary, opacity: 0.8 }}/>
        </div>
      </div>

      {/* AWAY TEAM — right half */}
      <div style={{
        position: "absolute", right: 0, top: 0, width: 980, height: 1080,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        gap: 32, zIndex: 5,
      }}>
        <img
          src={away.crest}
          alt={away.name}
          style={{ width: 280, height: 280, objectFit: "contain", filter: "drop-shadow(0 16px 40px rgba(0,0,0,0.4))" }}
        />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <span style={{
            ...D, fontWeight: 900, fontSize: 72, letterSpacing: "-0.02em", lineHeight: 0.92,
            color: "#E8E6DE", textAlign: "center", maxWidth: 700,
            textShadow: "0 4px 20px rgba(0,0,0,0.4)",
          }}>
            {away.name}
          </span>
          <div style={{ width: 80, height: 3, background: away.primary, opacity: 0.8 }}/>
        </div>
      </div>

      {/* VS chip — center overlay */}
      <div style={{
        position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)",
        zIndex: 20, display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
      }}>
        <div style={{
          background: "#0A0A0A", border: "2px solid #B8923A",
          padding: "10px 24px",
        }}>
          <span style={{ ...D, fontWeight: 900, fontSize: 28, color: "#B8923A", letterSpacing: "0.04em" }}>VS</span>
        </div>
      </div>

      {/* Bottom info bar */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 15,
        background: "linear-gradient(0deg, rgba(2,6,15,0.95) 0%, transparent 100%)",
        padding: "60px 80px 40px",
        display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 40,
      }}>
        {data.venue && (
          <span style={{ ...L, fontSize: 14, color: "#777777", letterSpacing: "0.12em" }}>{data.venue}</span>
        )}
        {data.venue && data.kickoff && (
          <span style={{ color: "#333333" }}>•</span>
        )}
        {data.kickoff && (
          <span style={{ ...L, fontSize: 14, color: "#B8923A", letterSpacing: "0.12em" }}>
            KICK OFF {data.kickoff}
          </span>
        )}
      </div>
    </div>
  );
}
