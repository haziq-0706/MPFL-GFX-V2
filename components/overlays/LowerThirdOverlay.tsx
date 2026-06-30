const DISPLAY = {
  fontFamily: "'Barlow Condensed', sans-serif",
  fontStyle: "italic" as const,
  fontWeight: 800,
  textTransform: "uppercase" as const,
};

const LABEL = {
  fontFamily: "'Inter', sans-serif",
  fontWeight: 600,
  textTransform: "uppercase" as const,
  letterSpacing: "0.1em",
};

export default function LowerThirdOverlay({
  data,
}: {
  data: Record<string, unknown>;
}) {
  const title = typeof data.title === "string" ? data.title : "";
  const subtitle = typeof data.subtitle === "string" ? data.subtitle : "";

  return (
    <div
      style={{
        position: "absolute",
        bottom: 148,
        left: 80,
        filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.7))",
      }}
    >
      {/* Gold accent bar */}
      <div style={{
        width: "100%",
        height: 3,
        background: "#B8923A",
      }} />

      {/* Subtitle / role chip */}
      {subtitle && (
        <div style={{
          background: "#0A0A0A",
          padding: "5px 16px",
          display: "inline-block",
          borderRight: "1px solid #1A1A1A",
        }}>
          <span style={{
            ...LABEL,
            fontSize: 11,
            color: "#B8923A",
            letterSpacing: "0.14em",
          }}>
            {subtitle}
          </span>
        </div>
      )}

      {/* Name / title plate */}
      <div style={{
        background: "#111111",
        padding: "10px 20px 12px",
        borderTop: "1px solid #1A1A1A",
        minWidth: 360,
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}>
        <span style={{
          ...DISPLAY,
          fontSize: 36,
          letterSpacing: "-0.01em",
          lineHeight: 1,
          color: "#E8E6DE",
        }}>
          {title}
        </span>
      </div>
    </div>
  );
}
