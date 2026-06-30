"use client";
import FilmGrain from "./FilmGrain";
import { TEAMS } from "@/lib/data/teams";
import type { LineupData, LineupPlayer } from "@/lib/supabase/types";
import type { TeamCode } from "@/lib/data/teams";

const D = { fontFamily: "'Barlow Condensed', sans-serif", fontStyle: "italic" as const, textTransform: "uppercase" as const };
const L = { fontFamily: "'Inter', sans-serif", fontWeight: 600, textTransform: "uppercase" as const };

function PlayerCard({ player, visible, index }: { player: LineupPlayer; visible: boolean; index: number }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 0,
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(24px)",
      transition: `opacity 0.5s cubic-bezier(0.16,0.84,0.44,1) ${index * 0.08}s, transform 0.5s cubic-bezier(0.16,0.84,0.44,1) ${index * 0.08}s`,
      borderBottom: "1px solid rgba(255,255,255,0.06)",
    }}>
      {/* Number */}
      <div style={{
        width: 120, height: 88, flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "rgba(184,146,58,0.08)",
        borderRight: "1px solid rgba(184,146,58,0.2)",
      }}>
        <span style={{
          ...D, fontWeight: 900, fontSize: 56, color: "#B8923A",
          letterSpacing: "-0.02em", lineHeight: 1, fontVariantNumeric: "tabular-nums",
        }}>
          {player.number}
        </span>
      </div>

      {/* Name */}
      <div style={{ flex: 1, padding: "0 40px" }}>
        <span style={{ ...D, fontWeight: 800, fontSize: 52, color: "#E8E6DE", letterSpacing: "-0.01em", lineHeight: 1 }}>
          {player.name}
        </span>
      </div>

      {/* Gold accent dot */}
      <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#B8923A", marginRight: 40, opacity: 0.6, flexShrink: 0 }}/>
    </div>
  );
}

export default function LineupGraphic({ data }: { data: LineupData }) {
  const team = TEAMS[data.team_code as TeamCode];
  const players = data.players || [];
  const revealed = data.revealed ?? 0;

  return (
    <div style={{
      position: "absolute", inset: 0, width: 1920, height: 1080, overflow: "hidden",
      background: "#0A0A0A",
    }}>
      <FilmGrain />

      {/* Team color accent bar — left edge */}
      <div style={{
        position: "absolute", top: 0, left: 0, width: 8, height: "100%",
        background: team?.primary || "#B8923A",
      }}/>

      {/* Background gradient using team color */}
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(ellipse at 0% 50%, ${team?.primary || "#B8923A"}18 0%, transparent 50%)`,
      }}/>
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at 100% 100%, rgba(26,37,69,0.5) 0%, transparent 60%)",
      }}/>

      {/* Header panel */}
      <div style={{
        display: "flex", alignItems: "center", gap: 36,
        padding: "40px 60px 32px 60px",
        borderBottom: "2px solid #1A1A1A",
      }}>
        {team && (
          <img
            src={team.crest}
            alt={team.code}
            style={{ width: 96, height: 96, objectFit: "contain", filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.6))" }}
          />
        )}
        <div>
          <span style={{ ...L, fontSize: 12, color: team?.primary || "#B8923A", letterSpacing: "0.2em", display: "block", marginBottom: 6 }}>
            Starting Five
          </span>
          <span style={{ ...D, fontWeight: 900, fontSize: 64, color: "#E8E6DE", letterSpacing: "-0.02em", lineHeight: 0.88 }}>
            {team?.name || data.team_code}
          </span>
        </div>
        <div style={{ flex: 1 }}/>
        <img src="/assets/mpfl-badge.png" alt="MPFL" style={{ height: 64, width: "auto", opacity: 0.5 }}/>
      </div>

      {/* Player list */}
      <div style={{ padding: "0 0 0 8px" }}>
        {players.slice(0, 5).map((player, i) => (
          <PlayerCard key={i} player={player} visible={i < revealed} index={i} />
        ))}
      </div>

      {/* Reveal counter bottom right */}
      <div style={{ position: "absolute", bottom: 40, right: 60, display: "flex", alignItems: "center", gap: 8 }}>
        {[0, 1, 2, 3, 4].map(i => (
          <div key={i} style={{
            width: 8, height: 8, borderRadius: "50%",
            background: i < revealed ? "#B8923A" : "#1A1A1A",
            border: "1px solid #333333",
          }}/>
        ))}
      </div>
    </div>
  );
}
