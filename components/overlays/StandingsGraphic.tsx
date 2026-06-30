import FilmGrain from "./FilmGrain";
import { TEAMS } from "@/lib/data/teams";
import type { TableData, StandingsRow, FormResult } from "@/lib/supabase/types";
import type { TeamCode } from "@/lib/data/teams";

const D = { fontFamily: "'Barlow Condensed', sans-serif", fontStyle: "italic" as const, textTransform: "uppercase" as const };
const L = { fontFamily: "'Inter', sans-serif", fontWeight: 600 as const, textTransform: "uppercase" as const };
const N = { fontFamily: "'Inter', sans-serif", fontVariantNumeric: "tabular-nums" as const };

function FormBox({ result }: { result: FormResult }) {
  const bg = result === "W" ? "#00C853" : result === "L" ? "#DD1E35" : "#555555";
  return (
    <div style={{
      width: 19, height: 19, background: bg,
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0,
    }}>
      <span style={{ ...L, fontSize: 9, color: "#fff", letterSpacing: 0 }}>{result}</span>
    </div>
  );
}

function Row({ row, index }: { row: StandingsRow; index: number }) {
  const team = TEAMS[row.code as TeamCode];
  const isTop = index === 0;
  const isEven = index % 2 === 0;
  const isLeader = row.pos <= 3;
  const isPlayoff = row.pos > 3 && row.pos <= 6;

  return (
    <div style={{
      display: "flex", alignItems: "center",
      height: isTop ? 86 : 72,
      background: isTop ? "rgba(184,146,58,0.055)" : isEven ? "rgba(255,255,255,0.016)" : "transparent",
      borderBottom: "1px solid rgba(255,255,255,0.038)",
    }}>
      {/* Left qualifier bar */}
      <div style={{
        width: 4, alignSelf: "stretch", flexShrink: 0,
        background: isLeader ? "#B8923A" : isPlayoff ? "#1565C0" : "transparent",
      }}/>

      {/* POS */}
      <span style={{
        ...D, fontWeight: 900,
        fontSize: isTop ? 34 : isLeader ? 26 : 22,
        color: isLeader ? "#B8923A" : "#3A3A3A",
        letterSpacing: "-0.01em", width: 52, textAlign: "center", flexShrink: 0,
      }}>
        {row.pos}
      </span>

      {/* Crest */}
      {team && (
        <img src={team.crest} alt={team.code} style={{
          width: isTop ? 38 : 28, height: isTop ? 38 : 28,
          objectFit: "contain", marginRight: 14, flexShrink: 0,
        }}/>
      )}

      {/* Team name + code */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", minWidth: 0, gap: 1 }}>
        <span style={{
          ...D, fontWeight: isTop ? 800 : 700,
          fontSize: isTop ? 28 : 22,
          color: "#E8E6DE", letterSpacing: "-0.01em", lineHeight: 1.1,
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>
          {row.name}
        </span>
        <span style={{ ...L, fontSize: 10, color: "#3A3A3A", letterSpacing: "0.14em" }}>
          {row.code}
        </span>
      </div>

      {/* P W D L */}
      {[row.p, row.w, row.d, row.l].map((v, i) => (
        <span key={i} style={{
          ...N, fontSize: isTop ? 19 : 16, color: "#5A5A5A",
          width: 40, textAlign: "center", flexShrink: 0,
        }}>
          {v}
        </span>
      ))}

      {/* GF:GA */}
      <span style={{
        ...N, fontSize: isTop ? 18 : 15, color: "#4A4A4A",
        width: 68, textAlign: "center", flexShrink: 0, letterSpacing: "-0.01em",
      }}>
        {row.gf ?? 0}:{row.ga ?? 0}
      </span>

      {/* GD */}
      <span style={{
        ...N, fontSize: isTop ? 19 : 16,
        color: (row.gd ?? 0) > 0 ? "#00C853" : (row.gd ?? 0) < 0 ? "#DD1E35" : "#5A5A5A",
        width: 52, textAlign: "center", flexShrink: 0,
      }}>
        {(row.gd ?? 0) > 0 ? `+${row.gd}` : row.gd}
      </span>

      {/* FORM */}
      <div style={{ width: 112, flexShrink: 0, display: "flex", gap: 3, justifyContent: "center" }}>
        {(row.form || []).slice(0, 5).map((f, i) => (
          <FormBox key={i} result={f as FormResult} />
        ))}
      </div>

      {/* PTS */}
      <span style={{
        ...N, fontWeight: 800, fontSize: isTop ? 26 : 20,
        color: "#E8E6DE", width: 60, textAlign: "right", flexShrink: 0, paddingRight: 24,
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
      background: "linear-gradient(160deg, #0A1230 0%, #060C1E 55%, #02060F 100%)",
      display: "flex", flexDirection: "column",
    }}>
      <FilmGrain />

      {/* Left gold accent */}
      <div style={{ position: "absolute", top: 0, left: 0, width: 5, height: "100%", background: "#B8923A" }}/>

      {/* Subtle radial bg */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 80% 20%, rgba(26,37,69,0.32) 0%, transparent 55%)" }}/>

      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "40px 48px 20px 40px", flexShrink: 0,
      }}>
        <div>
          <span style={{ ...L, fontSize: 12, color: "#B8923A", letterSpacing: "0.26em", display: "block", marginBottom: 4 }}>
            {data.season || "MPFL 2026 · LEAGUE"}
          </span>
          <div style={{ lineHeight: 0.92 }}>
            <span style={{ ...D, fontWeight: 900, fontSize: 72, color: "#E8E6DE", letterSpacing: "-0.02em" }}>LEAGUE </span>
            <span style={{ ...D, fontWeight: 900, fontSize: 72, color: "#B8923A", letterSpacing: "-0.02em" }}>
              {data.title || "STANDINGS"}
            </span>
          </div>
        </div>
        <img src="/assets/mpfl-badge.png" alt="MPFL" style={{ height: 88, width: "auto", opacity: 0.88 }}/>
      </div>

      {/* Column headers */}
      <div style={{
        display: "flex", alignItems: "center",
        height: 34,
        borderTop: "1px solid rgba(184,146,58,0.18)",
        borderBottom: "2px solid rgba(184,146,58,0.55)",
        background: "rgba(0,0,0,0.25)",
        margin: "0 0 0 5px",
        flexShrink: 0,
      }}>
        <div style={{ width: 4 }}/>
        <span style={{ ...L, fontSize: 10, color: "#3A3A3A", letterSpacing: "0.2em", width: 52, textAlign: "center", flexShrink: 0 }}>POS</span>
        <span style={{ width: 42, flexShrink: 0 }}/>
        <span style={{ ...L, fontSize: 10, color: "#3A3A3A", letterSpacing: "0.2em", flex: 1 }}>CLUB</span>
        {["P","W","D","L"].map(h => (
          <span key={h} style={{ ...L, fontSize: 10, color: "#3A3A3A", letterSpacing: "0.16em", width: 40, textAlign: "center", flexShrink: 0 }}>{h}</span>
        ))}
        <span style={{ ...L, fontSize: 10, color: "#3A3A3A", letterSpacing: "0.12em", width: 68, textAlign: "center", flexShrink: 0 }}>GF:GA</span>
        <span style={{ ...L, fontSize: 10, color: "#3A3A3A", letterSpacing: "0.16em", width: 52, textAlign: "center", flexShrink: 0 }}>GD</span>
        <span style={{ ...L, fontSize: 10, color: "#3A3A3A", letterSpacing: "0.16em", width: 112, textAlign: "center", flexShrink: 0 }}>FORM</span>
        <span style={{ ...L, fontSize: 10, color: "#3A3A3A", letterSpacing: "0.16em", width: 60, textAlign: "right", flexShrink: 0, paddingRight: 24 }}>PTS</span>
      </div>

      {/* Rows */}
      <div style={{ margin: "0 0 0 5px", flex: 1 }}>
        {rows.map((row, i) => <Row key={row.code} row={row} index={i} />)}
      </div>

      {/* Bottom legend */}
      <div style={{
        margin: "0 0 0 5px",
        padding: "12px 28px",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        background: "rgba(0,0,0,0.35)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 14, height: 3, background: "#B8923A" }}/>
            <span style={{ ...L, fontSize: 10, color: "#666", letterSpacing: "0.14em" }}>LEADERS: 1–3</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 14, height: 3, background: "#1565C0" }}/>
            <span style={{ ...L, fontSize: 10, color: "#666", letterSpacing: "0.14em" }}>PLAYOFF: 3–6</span>
          </div>
        </div>
        <span style={{ ...L, fontSize: 10, color: "#444", letterSpacing: "0.12em" }}>
          P PLAYED · W WON · D DRAWN · L LOST · GD GOAL DIFFERENCE
        </span>
      </div>
    </div>
  );
}
