export default function OutputLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="robots" content="noindex" />
      </head>
      {/* Transparent body — designed for OBS window/game capture */}
      <body
        style={{
          margin: 0,
          padding: 0,
          background: "transparent",
          overflow: "hidden",
          width: "1920px",
          height: "1080px",
        }}
      >
        {children}
      </body>
    </html>
  );
}
