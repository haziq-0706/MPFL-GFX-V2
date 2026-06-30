"use client";
import { useEffect, useState } from "react";
import FilmGrain from "./FilmGrain";
import { TEAMS } from "@/lib/data/teams";
import type { CountdownData } from "@/lib/supabase/types";
import type { TeamCode } from "@/lib/data/teams";

const D = { fontFamily: "'Barlow Condensed', sans-serif", fontStyle: "italic" as const, textTransform: "uppercase" as const };
const L = { fontFamily: "'Inter', sans-serif", fontWeight: 600 as const, textTransform: "uppercase" as const };

function fmt(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

export default function CountdownGraphic({ data }: { data: CountdownData }) {
  const [secs, setSecs] = useState(() => Math.max(0, Math.floor((data.target_time - Date.now()) / 1000)));

  useEffect(() => {
    const id = setInterval(() => {
      setSecs(Math.max(0, Math.floor((data.target_time - Date.now()) / 1000)));
    }, 500);
    return () => clearInterval(id);
  }, [data.target_time]);

  const homeTeam = data.home_code ? TEAMS[data.home_code as TeamCode] : null;
  const awayTeam = data.away_code ? TEAMS[data.away_code as TeamCode] : null;
  const homeName = homeTeam?.name || data.home_team;
  const awayName = awayTeam?.name || data.away_team;

  return (
    <div style={{
      position: "absolute", inset: 0, width: 1920, height: 1080, overflow: "hidden",
      background: "linear-gradient(160deg, #0A1230 0%, #060C1E 55%, #02060F 100%)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    }}>
      <FilmGrain />

      {/* Top + bottom accent bars */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "#B8923A" }}/>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: "rgba(184,146,58,0.3)" }}/>

      {/* MPFL badge top center */}
      <div style={{ position: "absolute", top: 56, left: "50%", transform: "translateX(-50%)" }}>
        <img src="/assets/mpfl-badge.png" alt="MPFL" style={{ height: 84, width: "auto" }}/>
      </div>

      {/* Main content */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: -16 }}>

        {/* "— KICK-OFF IN —" label */}
        <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 14 }}>
          <div style={{ width: 52, height: 1, background: "rgba(184,146,58,0.55)" }}/>
          <span style={{ ...L, fontSize: 15, color: "#B8923A", letterSpacing: "0.3em" }}>
            {data.label || "KICK-OFF IN"}
          </span>
          <div style={{ width: 52, height: 1, background: "rgba(184,146,58,0.55)" }}/>
        </div>

        {/* Countdown number */}
        <span style={{
          ...D, fontWeight: 900, fontSize: 280, letterSpacing: "-0.04em", lineHeight: 0.88,
          color: "#E8E6DE", fontVariantNumeric: "tabular-nums",
          textShadow: "0 0 120px rgba(184,146,58,0.18), 0 0 40px rgba(184,146,58,0.1)",
        }}>
          {fmt(secs)}
        </span>

        {/* Gold divider */}
        <div style={{
          width: 540, height: 2,
          background: "linear-gradient(90deg, transparent, rgba(184,146,58,0.75) 25%, rgba(184,146,58,0.75) 75%, transparent)",
          margin: "36px 0 30px",
        }}/>

        {/* Teams row with crests */}
        {(homeName || awayName) && (
          <div style={{ display: "flex", alignItems: "center", gap: 44 }}>
            {/* Home */}
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              {homeTeam && (
                <img
                  src={homeTeam.crest}
                  alt={homeTeam.code}
                  style={{ width: 54, height: 54, objectFit: "contain", filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.5))" }}
                />
              )}
              <span style={{ ...D, fontWeight: 800, fontSize: 44, letterSpacing: "-0.01em", color: "#E8E6DE" }}>
                {homeName}
              </span>
            </div>

            <span style={{ ...L, fontSize: 15, color: "#333", letterSpacing: "0.14em" }}>VS</span>

            {/* Away */}
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <span style={{ ...D, fontWeight: 800, fontSize: 44, letterSpacing: "-0.01em", color: "#E8E6DE" }}>
                {awayName}
              </span>
              {awayTeam && (
                <img
                  src={awayTeam.crest}
                  alt={awayTeam.code}
                  style={{ width: 54, height: 54, objectFit: "contain", filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.5))" }}
                />
              )}
            </div>
          </div>
        )}

        {/* Footer info line: date · venue · kickoff_time */}
        {(data.match_date || data.venue || data.kickoff_time) && (
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 22 }}>
            {data.match_date && (
              <span style={{ ...L, fontSize: 13, color: "#666", letterSpacing: "0.16em" }}>{data.match_date}</span>
            )}
            {data.match_date && data.venue && (
              <span style={{ color: "#2A2A2A", fontSize: 16 }}>·</span>
            )}
            {data.venue && (
              <span style={{ ...L, fontSize: 13, color: "#666", letterSpacing: "0.16em" }}>{data.venue}</span>
            )}
            {data.venue && data.kickoff_time && (
              <span style={{ color: "#2A2A2A", fontSize: 16 }}>·</span>
            )}
            {data.kickoff_time && (
              <span style={{ ...L, fontSize: 13, color: "#B8923A", letterSpacing: "0.16em" }}>{data.kickoff_time}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
