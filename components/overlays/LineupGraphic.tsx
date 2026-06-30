"use client";
import FilmGrain from "./FilmGrain";
import { TEAMS } from "@/lib/data/teams";
import type { LineupData, LineupPlayer, LineupPosition } from "@/lib/supabase/types";
import type { TeamCode } from "@/lib/data/teams";

const D = { fontFamily: "'Barlow Condensed', sans-serif", fontStyle: "italic" as const, textTransform: "uppercase" as const };
const L = { fontFamily: "'Inter', sans-serif", fontWeight: 600 as const, textTransform: "uppercase" as const };

const POSITION_FULL: Record<LineupPosition, string> = {
  GK: "GOALKEEPER",
  ALA: "ALA",
  FIXO: "FIXO",
  PIVO: "PIVO",
  COACH: "COACH",
};

const DEFAULT_POSITIONS: LineupPosition[] = ["GK", "ALA", "ALA", "PIVO", "FIXO"];

function PlayerColumn({
  player, visible, index, teamCode,
}: {
  player: LineupPlayer; visible: boolean; index: number; teamCode: string;
}) {
  const pos = (player.position || DEFAULT_POSITIONS[index] || "ALA") as LineupPosition;

  return (
    <div style={{
      flex: 1, display: "flex", flexDirection: "column",
      borderRight: index < 4 ? "1px solid rgba(255,255,255,0.055)" : "none",
      position: "relative", overflow: "hidden",
    }}>
      {/* Position label strip */}
      <div style={{
        padding: "18px 22px 14px",
        borderBottom: "1px solid rgba(255,255,255,0.055)",
        background: "rgba(0,0,0,0.18)",
        flexShrink: 0,
      }}>
        <span style={{ ...L, fontSize: 11, color: "#B8923A", letterSpacing: "0.22em" }}>
          {POSITION_FULL[pos] || pos}
        </span>
      </div>

      {/* Card body */}
      <div style={{ flex: 1, position: "relative" }}>

        {/* Hidden state: team code watermark */}
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          opacity: visible ? 0 : 1,
          transition: `opacity 0.4s ease ${index * 0.06}s`,
          pointerEvents: "none",
        }}>
          <span style={{
            ...D, fontWeight: 900, fontSize: 96, color: "rgba(255,255,255,0.045)",
            letterSpacing: "-0.02em",
          }}>
            {teamCode}
          </span>
        </div>

        {/* Revealed state: number + name */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          padding: "0 22px 36px",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(40px)",
          transition: `opacity 0.55s cubic-bezier(0.16,0.84,0.44,1) ${index * 0.09}s, transform 0.55s cubic-bezier(0.16,0.84,0.44,1) ${index * 0.09}s`,
        }}>
          {/* Jersey number */}
          <span style={{
            ...D, fontWeight: 900, fontSize: 96, color: "#B8923A",
            letterSpacing: "-0.04em", lineHeight: 0.85, display: "block",
            marginBottom: 10, fontVariantNumeric: "tabular-nums",
          }}>
            {player.number || "–"}
          </span>
          {/* Player name */}
          <span style={{
            ...D, fontWeight: 800, fontSize: 34, color: "#E8E6DE",
            letterSpacing: "-0.01em", lineHeight: 1.05, display: "block",
          }}>
            {player.name || "—"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function LineupGraphic({ data }: { data: LineupData }) {
  const team = TEAMS[data.team_code as TeamCode];
  const revealed = data.revealed ?? 0;
  const cols = Array.from({ length: 5 }, (_, i) => data.players?.[i] ?? { number: "–", name: "" });

  return (
    <div style={{
      position: "absolute", inset: 0, width: 1920, height: 1080, overflow: "hidden",
      background: "linear-gradient(160deg, #0A1230 0%, #060C1E 55%, #02060F 100%)",
      display: "flex", flexDirection: "column",
    }}>
      <FilmGrain />

      {/* Top accent bar — team color */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: team?.primary || "#B8923A" }}/>

      {/* Team color radial glow bottom-left */}
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(ellipse at 0% 100%, ${team?.primary || "#B8923A"}10 0%, transparent 48%)`,
      }}/>

      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "34px 52px 26px 52px",
        borderBottom: "1px solid rgba(255,255,255,0.065)",
        flexShrink: 0,
      }}>
        <div>
          {/* "— STARTING FIVE" label */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 4 }}>
            <div style={{ width: 20, height: 1, background: "rgba(184,146,58,0.55)" }}/>
            <span style={{ ...L, fontSize: 13, color: "#B8923A", letterSpacing: "0.3em" }}>STARTING FIVE</span>
          </div>
          {/* Team name */}
          <span style={{
            ...D, fontWeight: 900, fontSize: 80, color: "#E8E6DE",
            letterSpacing: "-0.025em", lineHeight: 0.9,
          }}>
            {team?.name || data.team_code}
          </span>
        </div>

        {/* Crest + MPFL badge */}
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          {team && (
            <img
              src={team.crest}
              alt={team.code}
              style={{ height: 72, width: "auto", objectFit: "contain", opacity: 0.72, filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.5))" }}
            />
          )}
          <img src="/assets/mpfl-badge.png" alt="MPFL" style={{ height: 52, width: "auto", opacity: 0.45 }}/>
        </div>
      </div>

      {/* Player columns */}
      <div style={{ display: "flex", flex: 1 }}>
        {cols.map((player, i) => (
          <PlayerColumn
            key={i}
            player={player as LineupPlayer}
            visible={i < revealed}
            index={i}
            teamCode={data.team_code}
          />
        ))}
      </div>
    </div>
  );
}
