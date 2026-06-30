import type { Match } from "@/lib/supabase/types";

export default function ScoreboardOverlay({ match }: { match: Match }) {
  const statusLabel: Record<string, string> = {
    pre: "PRE-MATCH",
    live: match.match_time,
    ht: "HT",
    ft: "FT",
  };

  return (
    <div
      style={{
        position: "absolute",
        bottom: 80,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        alignItems: "center",
        gap: 0,
        fontFamily: "system-ui, sans-serif",
        filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.5))",
      }}
    >
      {/* Home team */}
      <div style={{
        background: "#111", color: "#fff",
        padding: "10px 24px", minWidth: 200, textAlign: "right",
        fontSize: 22, fontWeight: 700, letterSpacing: 1,
        textTransform: "uppercase",
      }}>
        {match.home_team}
      </div>

      {/* Score */}
      <div style={{
        background: "#E8B000", color: "#000",
        padding: "10px 20px",
        display: "flex", alignItems: "center", gap: 12,
        fontSize: 28, fontWeight: 900,
      }}>
        <span>{match.home_score}</span>
        <span style={{ fontSize: 14, opacity: 0.7, fontWeight: 400 }}>
          {statusLabel[match.status] ?? match.status}
        </span>
        <span>{match.away_score}</span>
      </div>

      {/* Away team */}
      <div style={{
        background: "#111", color: "#fff",
        padding: "10px 24px", minWidth: 200,
        fontSize: 22, fontWeight: 700, letterSpacing: 1,
        textTransform: "uppercase",
      }}>
        {match.away_team}
      </div>
    </div>
  );
}
