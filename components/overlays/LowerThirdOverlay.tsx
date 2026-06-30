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
        bottom: 160,
        left: 80,
        fontFamily: "system-ui, sans-serif",
        filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.5))",
      }}
    >
      <div style={{
        background: "#E8B000",
        padding: "6px 20px",
        display: "inline-block",
        fontSize: 13,
        fontWeight: 700,
        color: "#000",
        textTransform: "uppercase",
        letterSpacing: 2,
      }}>
        {subtitle}
      </div>
      <div style={{
        background: "#111",
        padding: "10px 20px",
        fontSize: 28,
        fontWeight: 700,
        color: "#fff",
        minWidth: 340,
      }}>
        {title}
      </div>
    </div>
  );
}
