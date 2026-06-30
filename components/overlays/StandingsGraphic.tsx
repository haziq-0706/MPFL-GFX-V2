import FilmGrain from "./FilmGrain";
import { TEAMS } from "@/lib/data/teams";
import type { TableData, StandingsRow } from "@/lib/supabase/types";
import type { TeamCode } from "@/lib/data/teams";

const D = { fontFamily: "'Barlow Condensed', sans-serif", fontStyle: "italic" as const, textTransform: "uppercase" as const };
const L = { fontFamily: "'Inter', sans-serif", fontWeight: 600, textTransform: "uppercase" as const };
const N = { fontFamily: "'Inter', sans-serif", fontVariantNumeric: "tabular-nums" as const };

function Row({ row, index }: { row: StandingsRow; index: number }) {
  const team = TEAMS[row.code as TeamCode];
  const isLeader = row.pos === 1;
  const isEven = index % 2 === 0;
  return (
    <div style={{
      display: "flex", alignItems: "center",
      padding: isLeader ? "14px 32px" : "10px 32px",
      background: isLeader ? "rgba(184,146,58,0.08)" : isEven ? "rgba(255,255,255,0.02)" : "transparent",
      borderBottom: "1px solid rgba(255,255,255,0.04)",
    }}>
      {/* Position */}
      <span style={{
        ...D, fontWeight: 900, fontSize: isLeader ? 32 : 24,
        color: row.pos <= 3 ? "#B8923A" : "#555555",
        letterSpacing: "-0.01em", width: 48, flexShrink: 0,
      }}>
        {row.pos}
      </span>

      {/* Crest */}
      {team && (
        <img src={team.crest} alt={team.code} style={{
          width: isLeader ? 36 : 28, height: isLeader ? 36 : 28,
          objectFit: "contain", marginRight: 12, flexShrink: 0,
        }}/>
      )}

      {/* Team name */}
      <span style={{
        ...D, fontWeight: isLeader ? 800 : 700,
        fontSize: isLeader ? 28 : 22,
        color: "#E8E6DE", letterSpacing: "-0.01em", flex: 1,
      }}>
        {row.name}
      </span>

      {/* Stats */}
      {[row.p, row.w, row.d, row.l].map((v, i) => (
        <span key={i} style={{ ...N, fontSize: isLeader ? 20 : 17, color: "#777777", width: 44, textAlign: "center", flexShrink: 0 }}>
          {v}
        </span>
      ))}
      <span style={{
        ...N, fontSize: isLeader ? 20 : 17,
        color: row.gd > 0 ? "#00C853" : row.gd < 0 ? "#DD1E35" : "#777777",
        width: 56, textAlign: "center", flexShrink: 0,
      }}>
        {row.gd > 0 ? `+${row.gd}` : row.gd}
      </span>
      <span style={{
        ...N, fontWeight: 700, fontSize: isLeader ? 22 : 18,
        color: "#E8E6DE", width: 56, textAlign: "right", flexShrink: 0,
      }}>
        {row.pts}
      </span>
    </div>
  );
}

export default function StandingsGraphic({ data }: { data: TableData }) {
  const rows = data.rows || [];
  return (
    <div style={{
      position: "absolute", inset: 0, width: 1920, height: 1080, overflow: "hidden",
      background: "#0A0A0A",
    }}>
      <FilmGrain />

      {/* Side accent */}
      <div style={{ position: "absolute", top: 0, left: 0, width: 6, height: "100%", background: "#B8923A" }}/>
      <div style={{ position: "absolute", top: 0, right: 0, width: 2, height: "100%", background: "#1A1A1A" }}/>

      {/* Background texture */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at 80% 20%, rgba(26,37,69,0.3) 0%, transparent 60%)",
      }}/>

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
            {data.title || "League Standings"}
          </span>
        </div>
        <img src="/assets/mpfl-badge.png" alt="MPFL" style={{ height: 80, width: "auto", opacity: 0.85 }}/>
      </div>

      {/* Column headers */}
      <div style={{
        display: "flex", alignItems: "center",
        padding: "8px 32px 8px",
        borderBottom: "2px solid #B8923A",
        margin: "0 0 0 6px",
      }}>
        <span style={{ ...L, fontSize: 11, color: "#555555", letterSpacing: "0.16em", width: 48, flexShrink: 0 }}>POS</span>
        <span style={{ width: 40, flexShrink: 0 }}/>
        <span style={{ ...L, fontSize: 11, color: "#555555", letterSpacing: "0.16em", flex: 1 }}>CLUB</span>
        {["P", "W", "D", "L", "GD", "PTS"].map(h => (
          <span key={h} style={{ ...L, fontSize: 11, color: "#555555", letterSpacing: "0.12em", width: h === "GD" || h === "PTS" ? 56 : 44, textAlign: "center", flexShrink: 0 }}>
            {h}
          </span>
        ))}
      </div>

      {/* Rows */}
      <div style={{ margin: "0 0 0 6px" }}>
        {rows.map((row, i) => <Row key={row.code} row={row} index={i} />)}
      </div>
    </div>
  );
}
