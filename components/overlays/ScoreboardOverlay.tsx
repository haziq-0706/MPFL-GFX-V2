import type { Match } from "@/lib/supabase/types";

const DISPLAY = {
  fontFamily: "'Barlow Condensed', sans-serif",
  fontStyle: "italic" as const,
  fontWeight: 900,
  textTransform: "uppercase" as const,
};

const LABEL = {
  fontFamily: "'Inter', sans-serif",
  fontWeight: 600,
  textTransform: "uppercase" as const,
  letterSpacing: "0.1em",
};

export default function ScoreboardOverlay({ match }: { match: Match }) {
  const isPeriodLabel = match.status !== "live";
  const periodLabels: Record<string, string> = { pre: "PRE-MATCH", ht: "HALF TIME", ft: "FULL TIME" };
  const centerLabel = isPeriodLabel
    ? (periodLabels[match.status] ?? match.status.toUpperCase())
    : match.match_time;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 72,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        alignItems: "stretch",
        filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.7))",
      }}
    >
      {/* Home team block */}
      <div style={{
        background: "#111111",
        borderTop: "2px solid #1A1A1A",
        padding: "12px 28px",
        minWidth: 220,
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
      }}>
        <span style={{
          ...DISPLAY,
          fontSize: 28,
          letterSpacing: "-0.01em",
          lineHeight: 1,
          color: "#E8E6DE",
        }}>
          {match.home_team}
        </span>
      </div>

      {/* Score / status block */}
      <div style={{
        background: "#0A0A0A",
        borderTop: "2px solid #B8923A",
        padding: "12px 0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minWidth: 140,
        gap: 2,
      }}>
        {/* Status label */}
        <span style={{
          ...LABEL,
          fontSize: 10,
          color: "#777777",
          letterSpacing: "0.14em",
        }}>
          {isPeriodLabel ? centerLabel : "LIVE"}
        </span>

        {/* Score */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{
            ...DISPLAY,
            fontSize: 52,
            letterSpacing: "-0.02em",
            lineHeight: 0.92,
            color: "#B8923A",
            fontVariantNumeric: "tabular-nums",
          }}>
            {match.home_score}
          </span>
          <span style={{
            ...LABEL,
            fontSize: 18,
            color: "#333333",
            letterSpacing: 0,
          }}>
            -
          </span>
          <span style={{
            ...DISPLAY,
            fontSize: 52,
            letterSpacing: "-0.02em",
            lineHeight: 0.92,
            color: "#B8923A",
            fontVariantNumeric: "tabular-nums",
          }}>
            {match.away_score}
          </span>
        </div>

        {/* Time when live */}
        {!isPeriodLabel && (
          <span style={{
            ...LABEL,
            fontSize: 11,
            color: "#E8E6DE",
            letterSpacing: "0.1em",
          }}>
            {match.match_time}
          </span>
        )}
      </div>

      {/* Away team block */}
      <div style={{
        background: "#111111",
        borderTop: "2px solid #1A1A1A",
        padding: "12px 28px",
        minWidth: 220,
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
      }}>
        <span style={{
          ...DISPLAY,
          fontSize: 28,
          letterSpacing: "-0.01em",
          lineHeight: 1,
          color: "#E8E6DE",
        }}>
          {match.away_team}
        </span>
      </div>

      {/* LIVE bug */}
      {match.status === "live" && (
        <div style={{
          position: "absolute",
          top: -28,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          alignItems: "center",
          gap: 5,
          background: "#0A0A0A",
          padding: "3px 10px",
          border: "1px solid #1A1A1A",
        }}>
          <span style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: "#00C853",
            display: "inline-block",
            animation: "livePulse 1.2s ease-in-out infinite",
          }} />
          <span style={{
            ...LABEL,
            fontSize: 10,
            color: "#E8E6DE",
            letterSpacing: "0.16em",
          }}>
            LIVE
          </span>
        </div>
      )}

      <style>{`
        @keyframes livePulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}
