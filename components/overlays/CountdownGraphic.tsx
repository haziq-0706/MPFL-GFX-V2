"use client";
import { useEffect, useState } from "react";
import FilmGrain from "./FilmGrain";
import type { CountdownData } from "@/lib/supabase/types";

const D = { fontFamily: "'Barlow Condensed', sans-serif", fontStyle: "italic" as const, textTransform: "uppercase" as const };
const L = { fontFamily: "'Inter', sans-serif", fontWeight: 600, textTransform: "uppercase" as const };

function fmt(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

export default function CountdownGraphic({ data }: { data: CountdownData }) {
  const [secs, setSecs] = useState(() => {
    const rem = Math.max(0, Math.floor((data.target_time - Date.now()) / 1000));
    return rem;
  });

  useEffect(() => {
    const id = setInterval(() => {
      const rem = Math.max(0, Math.floor((data.target_time - Date.now()) / 1000));
      setSecs(rem);
    }, 500);
    return () => clearInterval(id);
  }, [data.target_time]);

  return (
    <div style={{
      position: "absolute", inset: 0, width: 1920, height: 1080, overflow: "hidden",
      background: "linear-gradient(135deg, #060C1E 0%, #0A1230 50%, #02060F 100%)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    }}>
      <FilmGrain />

      {/* Accent lines */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "#B8923A" }}/>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 4, background: "rgba(184,146,58,0.4)" }}/>

      {/* MPFL badge */}
      <div style={{ position: "absolute", top: 48, left: "50%", transform: "translateX(-50%)" }}>
        <img src="/assets/mpfl-badge.png" alt="MPFL" style={{ height: 72, width: "auto" }}/>
      </div>

      {/* Main content */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
        {/* Label */}
        <span style={{ ...L, fontSize: 18, color: "#B8923A", letterSpacing: "0.28em", marginBottom: 12 }}>
          {data.label || "KICK OFF IN"}
        </span>

        {/* Countdown */}
        <span style={{
          ...D, fontWeight: 900, fontSize: 280, letterSpacing: "-0.04em", lineHeight: 0.88,
          color: "#E8E6DE", fontVariantNumeric: "tabular-nums",
          textShadow: "0 0 80px rgba(184,146,58,0.25)",
        }}>
          {fmt(secs)}
        </span>

        {/* Divider */}
        <div style={{ width: 480, height: 2, background: "linear-gradient(90deg, transparent, #B8923A, transparent)", margin: "32px 0" }}/>

        {/* Match info */}
        {(data.home_team || data.away_team) && (
          <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
            <span style={{ ...D, fontWeight: 800, fontSize: 48, letterSpacing: "-0.01em", color: "#E8E6DE" }}>
              {data.home_team}
            </span>
            <span style={{ ...L, fontSize: 20, color: "#333333" }}>vs</span>
            <span style={{ ...D, fontWeight: 800, fontSize: 48, letterSpacing: "-0.01em", color: "#E8E6DE" }}>
              {data.away_team}
            </span>
          </div>
        )}

        {/* Competition / venue */}
        {(data.competition || data.venue) && (
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 16 }}>
            {data.competition && (
              <span style={{ ...L, fontSize: 13, color: "#777777", letterSpacing: "0.14em" }}>{data.competition}</span>
            )}
            {data.competition && data.venue && (
              <span style={{ color: "#333333", fontSize: 13 }}>•</span>
            )}
            {data.venue && (
              <span style={{ ...L, fontSize: 13, color: "#777777", letterSpacing: "0.14em" }}>{data.venue}</span>
            )}
          </div>
        )}
      </div>

      {/* Corner decorations */}
      <div style={{ position: "absolute", bottom: 48, right: 60 }}>
        <img src="/assets/mpfl-horizontal.png" alt="MPFL" style={{ height: 28, width: "auto", opacity: 0.4 }}/>
      </div>
    </div>
  );
}
