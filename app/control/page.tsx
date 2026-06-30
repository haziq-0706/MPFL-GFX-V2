"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { BroadcastState } from "@/lib/supabase/types";

// ── Typography helpers ──────────────────────────────────────────────────────
const D: React.CSSProperties = {
  fontFamily: "'Barlow Condensed', sans-serif",
  fontStyle: "italic",
  textTransform: "uppercase",
};

// ── Panel registry ──────────────────────────────────────────────────────────
type PanelId =
  | "match-setup" | "countdown" | "matchid" | "schedule" | "table"
  | "player-vs-player" | "super-lower-thirds" | "home-squad" | "away-squad"
  | "player-focus" | "player-photos"
  | "scorebug" | "card-event" | "goal-scorer" | "l3-score" | "referee";

interface NavItem {
  id: PanelId;
  label: string;
  shortcut: string;
  placeholder?: boolean;
}

const PRE_MATCH: NavItem[] = [
  { id: "match-setup",        label: "Match Setup",        shortcut: "S" },
  { id: "countdown",          label: "Kickoff Countdown",  shortcut: "K" },
  { id: "matchid",            label: "Match ID",           shortcut: "I" },
  { id: "schedule",           label: "Match Schedule",     shortcut: "H" },
  { id: "table",              label: "League Table",       shortcut: "L" },
  { id: "player-vs-player",   label: "Player vs Player",   shortcut: "V", placeholder: true },
  { id: "super-lower-thirds", label: "Super Lower Thirds", shortcut: "U", placeholder: true },
  { id: "home-squad",         label: "Home Squad",         shortcut: "Q", placeholder: true },
  { id: "away-squad",         label: "Away Squad",         shortcut: "A", placeholder: true },
  { id: "player-focus",       label: "Player Focus",       shortcut: "F", placeholder: true },
  { id: "player-photos",      label: "Player Photos",      shortcut: "P" },
];

const IN_GAME: NavItem[] = [
  { id: "scorebug",    label: "Scorebug",    shortcut: "B", placeholder: true },
  { id: "card-event",  label: "Card Event",  shortcut: "E", placeholder: true },
  { id: "goal-scorer", label: "Goal Scorer", shortcut: "G", placeholder: true },
  { id: "l3-score",    label: "L3 Score",    shortcut: "3", placeholder: true },
  { id: "referee",     label: "Referee",     shortcut: "R", placeholder: true },
];

const ALL_ITEMS = [...PRE_MATCH, ...IN_GAME];
type SidebarTab = "live" | "library" | "settings";

// ── Sidebar nav item ────────────────────────────────────────────────────────
function SidebarItem({
  item, active, onClick,
}: {
  item: NavItem; active: boolean; onClick: () => void;
}) {
  const [hov, setHov] = useState(false);
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onKeyDown={e => e.key === "Enter" && onClick()}
      style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "7px 12px 7px 14px", cursor: "pointer",
        background: active
          ? "rgba(184,146,58,0.07)"
          : hov ? "rgba(255,255,255,0.025)" : "transparent",
        borderLeft: `2px solid ${active ? "#B8923A" : "transparent"}`,
      }}
    >
      <span style={{
        fontFamily: "'Inter', sans-serif", fontSize: 11,
        fontWeight: active ? 600 : 500, letterSpacing: "0.06em",
        textTransform: "uppercase",
        color: active ? "#E8E6DE" : item.placeholder ? "#2C2C2C" : "#484848",
      }}>
        {item.label}
      </span>
      <kbd style={{
        background: active ? "rgba(184,146,58,0.1)" : "#0D0D0D",
        border: `1px solid ${active ? "rgba(184,146,58,0.25)" : "#141414"}`,
        padding: "1px 4px", borderRadius: 2, fontSize: 9,
        color: active ? "#B8923A" : "#252525",
        fontFamily: "ui-monospace, 'SF Mono', monospace",
      }}>
        {item.shortcut}
      </kbd>
    </div>
  );
}

// ── Placeholder panel content ───────────────────────────────────────────────
function PlaceholderPanel({ item }: { item: NavItem }) {
  return (
    <div style={{ padding: "28px 32px" }}>
      {/* Panel heading */}
      <div style={{ marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid #111" }}>
        <span style={{
          fontFamily: "'Inter', sans-serif", fontSize: 9, fontWeight: 700,
          color: "#2E2E2E", letterSpacing: "0.24em", display: "block", marginBottom: 8,
        }}>
          {item.placeholder ? "NOT YET BUILT" : "CONTENT PANEL · PHASE 2"}
        </span>
        <h2 style={{
          ...D, fontWeight: 900, fontSize: 32, color: "#E8E6DE",
          letterSpacing: "-0.01em", margin: 0, lineHeight: 1,
        }}>
          {item.label}
        </h2>
      </div>

      {/* Placeholder body */}
      <div style={{
        border: "1px solid #0F0F0F", padding: "80px 40px",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexDirection: "column", gap: 16, background: "#050505",
      }}>
        <div style={{
          width: 48, height: 48, border: "1px solid #141414",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ ...D, fontWeight: 900, fontSize: 22, color: "#1C1C1C" }}>
            {item.shortcut}
          </span>
        </div>
        <div style={{ textAlign: "center" }}>
          <span style={{
            fontFamily: "'Inter', sans-serif", fontSize: 11,
            color: "#1E1E1E", letterSpacing: "0.2em", display: "block",
          }}>
            {item.placeholder
              ? "Panel not yet implemented"
              : "Wiring this panel in a later phase"}
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Main control page ───────────────────────────────────────────────────────
export default function ControlPage() {
  const [liveState, setLiveState]     = useState<BroadcastState | null>(null);
  const [activePanel, setActivePanel] = useState<PanelId>("match-setup");
  const [search, setSearch]           = useState("");
  const [subtitle, setSubtitle]       = useState("Broadcast Graphic system");
  const [sidebarTab, setSidebarTab]   = useState<SidebarTab>("live");
  const searchRef = useRef<HTMLInputElement>(null);

  // ── Supabase: watch broadcast state ────────────────────────────────────
  useEffect(() => {
    const sb = createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (sb as any).from("broadcast_state").select("*").eq("id", "main").single()
      .then(({ data }: { data: BroadcastState }) => { if (data) setLiveState(data); });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ch = (sb as any).channel("shell-v1")
      .on("postgres_changes", { event: "*", schema: "public", table: "broadcast_state" },
        (p: { new: BroadcastState }) => setLiveState(p.new))
      .subscribe();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return () => { (sb as any).removeChannel(ch); };
  }, []);

  // ── ALL OUT ─────────────────────────────────────────────────────────────
  const allOut = useCallback(async () => {
    const sb = createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (sb as any).from("broadcast_state")
      .update({ active_overlay: null, is_live: false })
      .eq("id", "main");
  }, []);

  // ── Keyboard shortcuts ──────────────────────────────────────────────────
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const el = e.target as HTMLElement;
      if (["INPUT","TEXTAREA","SELECT"].includes(el.tagName) || el.isContentEditable) return;

      if (e.key === "Escape") {
        e.preventDefault();
        void allOut();
        return;
      }
      if (e.key === "/") {
        e.preventDefault();
        searchRef.current?.focus();
        return;
      }
      const hit = ALL_ITEMS.find(i => i.shortcut.toLowerCase() === e.key.toLowerCase());
      if (hit) setActivePanel(hit.id);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [allOut]);

  // ── Derived state ───────────────────────────────────────────────────────
  const isOnAir    = !!(liveState?.is_live && liveState.active_overlay);
  const onAirCount = isOnAir ? 1 : 0;

  const filteredPre = search
    ? PRE_MATCH.filter(i => i.label.toLowerCase().includes(search.toLowerCase()))
    : PRE_MATCH;
  const filteredIn = search
    ? IN_GAME.filter(i => i.label.toLowerCase().includes(search.toLowerCase()))
    : IN_GAME;

  const activeItem = ALL_ITEMS.find(i => i.id === activePanel) ?? PRE_MATCH[0];

  // ── Status pill ─────────────────────────────────────────────────────────
  const statusLabel = isOnAir
    ? (liveState?.active_overlay as string || "").toUpperCase().replace("-", " ")
    : "OFF AIR";

  return (
    <div style={{
      height: "100vh", overflow: "hidden",
      display: "flex", flexDirection: "column",
      background: "#0A0A0A", color: "#E8E6DE",
      fontFamily: "'Inter', sans-serif",
      userSelect: "none",
    }}>
      <style>{`
        @keyframes livePulse { 0%,100% { opacity:1; } 50% { opacity:0.3; } }
        * { box-sizing: border-box; }
        input { outline: none; }
        button:active { filter: brightness(0.85); }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #1A1A1A; border-radius: 2px; }
      `}</style>

      {/* ════════════════ TOP BAR ════════════════ */}
      <header style={{
        height: 48, flexShrink: 0,
        background: "#050505", borderBottom: "1px solid #111",
        display: "flex", alignItems: "center",
        padding: "0 20px", gap: 24,
      }}>
        {/* Logo + name */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <img
            src="/assets/mpfl-badge.png" alt="MPFL"
            style={{ width: 26, height: 26, objectFit: "contain" }}
          />
          <div>
            <div style={{
              ...D, fontWeight: 900, fontSize: 15,
              letterSpacing: "0.04em", color: "#E8E6DE", lineHeight: 1.15,
            }}>
              SERENTECH
            </div>
            <input
              value={subtitle}
              onChange={e => setSubtitle(e.target.value)}
              title="Click to edit"
              style={{
                background: "transparent", border: "none",
                borderBottom: "1px solid transparent",
                color: "#3E3E3E", fontSize: 9.5,
                letterSpacing: "0.1em", padding: "0 0 1px",
                width: 180, fontFamily: "'Inter', sans-serif",
                transition: "border-color 0.15s, color 0.15s",
                cursor: "text",
              }}
              onFocus={e => {
                e.target.style.color = "#B8923A";
                e.target.style.borderBottomColor = "rgba(184,146,58,0.35)";
              }}
              onBlur={e => {
                e.target.style.color = "#3E3E3E";
                e.target.style.borderBottomColor = "transparent";
              }}
            />
          </div>
        </div>

        {/* ── Center: status placeholder ── */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
          {/* Status pill */}
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "#0D0D0D", border: "1px solid #141414",
            padding: "4px 10px",
          }}>
            {isOnAir ? (
              <>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#00C853", animation: "livePulse 1.2s ease-in-out infinite", flexShrink: 0 }}/>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", color: "#00C853" }}>{statusLabel}</span>
              </>
            ) : (
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", color: "#2A2A2A" }}>FULL-TIME</span>
            )}
          </div>

          {/* Score placeholder */}
          <span style={{ fontSize: 12, color: "#2C2C2C", letterSpacing: "0.06em", fontWeight: 500 }}>
            — — — — —
          </span>

          {/* Period + clock placeholder */}
          <span style={{
            fontSize: 9, color: "#1E1E1E", letterSpacing: "0.18em",
            fontWeight: 600, padding: "4px 8px",
            border: "1px solid #0D0D0D",
          }}>
            P1  00:00
          </span>

          <span style={{ fontSize: 9, color: "#1A1A1A", letterSpacing: "0.14em", marginLeft: 4 }}>
            WIRED PHASE 2
          </span>
        </div>

        {/* ── Right: on air / buttons ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <span style={{ fontSize: 10, color: "#2E2E2E", letterSpacing: "0.14em" }}>
            on air: {onAirCount}
          </span>

          <button
            onClick={() => window.open("/output", "_blank")}
            style={{
              padding: "5px 12px", background: "#0D0D0D",
              border: "1px solid #141414", color: "#666",
              cursor: "pointer", fontSize: 10, fontWeight: 600,
              letterSpacing: "0.14em", fontFamily: "'Inter', sans-serif",
              display: "flex", alignItems: "center", gap: 5,
            }}
          >
            OPEN OUTPUT <span style={{ fontSize: 11, marginTop: -1 }}>↗</span>
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <button
              onClick={() => void allOut()}
              style={{
                padding: "5px 12px", background: "#0D0D0D",
                border: "1px solid #141414", color: "#555",
                cursor: "pointer", fontSize: 10, fontWeight: 700,
                letterSpacing: "0.14em", fontFamily: "'Inter', sans-serif",
              }}
            >
              ALL OUT
            </button>
            <kbd style={{
              background: "#0D0D0D", border: "1px solid #141414",
              padding: "2px 5px", borderRadius: 2, fontSize: 9,
              color: "#252525", fontFamily: "ui-monospace, 'SF Mono', monospace",
            }}>
              ⌘Esc
            </kbd>
          </div>
        </div>
      </header>

      {/* ════════════════ BODY ════════════════ */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* ════ LEFT SIDEBAR ════ */}
        <nav style={{
          width: 180, flexShrink: 0,
          background: "#050505", borderRight: "1px solid #0D0D0D",
          display: "flex", flexDirection: "column",
        }}>
          {/* Filter input */}
          <div style={{ padding: "8px 10px", borderBottom: "1px solid #0D0D0D" }}>
            <div style={{ position: "relative" }}>
              <svg
                style={{ position: "absolute", left: 7, top: "50%", transform: "translateY(-50%)", color: "#2A2A2A", pointerEvents: "none" }}
                width="10" height="10" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
              >
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                ref={searchRef}
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Filter panels..."
                style={{
                  width: "100%", background: "#0D0D0D",
                  border: "1px solid #0F0F0F",
                  color: "#E8E6DE", padding: "5px 8px 5px 22px",
                  fontSize: 10, fontFamily: "'Inter', sans-serif",
                  letterSpacing: "0.04em",
                  transition: "border-color 0.15s",
                }}
                onFocus={e => { e.target.style.borderColor = "rgba(184,146,58,0.3)"; }}
                onBlur={e => { e.target.style.borderColor = "#0F0F0F"; }}
              />
            </div>
          </div>

          {/* Scrollable nav */}
          <div style={{ flex: 1, overflowY: "auto", paddingBottom: 8 }}>

            {/* PRE MATCH */}
            {filteredPre.length > 0 && (
              <>
                <div style={{ padding: "10px 14px 4px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 9, fontWeight: 700, color: "#272727", letterSpacing: "0.22em" }}>
                    PRE MATCH
                  </span>
                  <span style={{ fontSize: 9, color: "#1A1A1A", fontFamily: "monospace" }}>1</span>
                </div>
                {filteredPre.map(item => (
                  <SidebarItem
                    key={item.id}
                    item={item}
                    active={activePanel === item.id}
                    onClick={() => setActivePanel(item.id)}
                  />
                ))}
              </>
            )}

            {/* IN GAME */}
            {filteredIn.length > 0 && (
              <>
                <div style={{ padding: "12px 14px 4px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 9, fontWeight: 700, color: "#272727", letterSpacing: "0.22em" }}>
                    IN GAME
                  </span>
                  <span style={{ fontSize: 9, color: "#1A1A1A", fontFamily: "monospace" }}>2</span>
                </div>
                {filteredIn.map(item => (
                  <SidebarItem
                    key={item.id}
                    item={item}
                    active={activePanel === item.id}
                    onClick={() => setActivePanel(item.id)}
                  />
                ))}
              </>
            )}

            {filteredPre.length === 0 && filteredIn.length === 0 && (
              <div style={{ padding: "24px 16px", textAlign: "center" }}>
                <span style={{ fontSize: 10, color: "#1E1E1E", letterSpacing: "0.14em" }}>No panels found</span>
              </div>
            )}
          </div>

          {/* Bottom tabs */}
          <div style={{ borderTop: "1px solid #0D0D0D", display: "flex", flexShrink: 0 }}>
            {(["live", "library", "settings"] as SidebarTab[]).map(tab => (
              <button
                key={tab}
                onClick={() => setSidebarTab(tab)}
                style={{
                  flex: 1, padding: "10px 0",
                  background: "transparent", border: "none",
                  cursor: "pointer", fontSize: 10, fontWeight: 600,
                  letterSpacing: "0.1em", textTransform: "capitalize",
                  color: sidebarTab === tab ? "#E8E6DE" : "#2A2A2A",
                  borderTop: `2px solid ${sidebarTab === tab ? "#B8923A" : "transparent"}`,
                  fontFamily: "'Inter', sans-serif",
                  transition: "color 0.15s",
                }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </nav>

        {/* ════ MAIN CONTENT ════ */}
        <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>

          {/* Monitor row */}
          <div style={{
            flexShrink: 0, background: "#050505",
            borderBottom: "1px solid #0D0D0D",
            padding: "14px 20px 14px",
            display: "flex", gap: 14, alignItems: "stretch",
          }}>

            {/* PREVIEW monitor */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#252525" }}/>
                <span style={{ fontSize: 9, fontWeight: 700, color: "#2E2E2E", letterSpacing: "0.26em" }}>PREVIEW</span>
              </div>
              <div style={{
                flex: 1, background: "#080808", border: "1px solid #111",
                aspectRatio: "16/9",
                display: "flex", alignItems: "center", justifyContent: "center",
                minHeight: 188,
              }}>
                <span style={{ fontSize: 10, color: "#161616", letterSpacing: "0.22em", fontWeight: 600 }}>
                  SELECT A GRAPHIC
                </span>
              </div>
            </div>

            {/* PROGRAM monitor */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{
                  width: 5, height: 5, borderRadius: "50%",
                  background: isOnAir ? "#00C853" : "#252525",
                  animation: isOnAir ? "livePulse 1.2s ease-in-out infinite" : "none",
                }}/>
                <span style={{
                  fontSize: 9, fontWeight: 700, letterSpacing: "0.26em",
                  color: isOnAir ? "#00C853" : "#2E2E2E",
                }}>PROGRAM</span>
              </div>
              <div style={{
                flex: 1, background: "#080808",
                border: `1px solid ${isOnAir ? "rgba(0,200,83,0.18)" : "#111"}`,
                aspectRatio: "16/9",
                display: "flex", alignItems: "center", justifyContent: "center",
                minHeight: 188,
              }}>
                <span style={{ fontSize: 10, color: "#161616", letterSpacing: "0.22em", fontWeight: 600 }}>
                  {isOnAir
                    ? (liveState?.active_overlay as string || "").toUpperCase().replace("-", " ")
                    : "NO GRAPHICS ON AIR"}
                </span>
              </div>
            </div>

            {/* ON AIR control column */}
            <div style={{
              width: 238, flexShrink: 0,
              display: "flex", flexDirection: "column",
              border: "1px solid #0D0D0D", background: "#080808",
            }}>
              {/* Header */}
              <div style={{
                padding: "8px 14px", borderBottom: "1px solid #0D0D0D",
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}>
                <span style={{ fontSize: 9, fontWeight: 700, color: "#2E2E2E", letterSpacing: "0.26em" }}>ON AIR</span>
                <span style={{ fontSize: 10, color: "#1E1E1E", letterSpacing: "0.1em", fontWeight: 600 }}>
                  — {onAirCount}
                </span>
              </div>

              {/* Status text */}
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 16px" }}>
                <span style={{ fontSize: 10, color: "#161616", letterSpacing: "0.2em", textAlign: "center", fontWeight: 500 }}>
                  {isOnAir
                    ? (liveState?.active_overlay as string || "").toUpperCase().replace("-", " ")
                    : "No graphics on air"}
                </span>
              </div>

              {/* TAKE / CUT / ALL OUT buttons */}
              <div style={{ padding: "10px" }}>
                <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                  {/* TAKE */}
                  <button style={{
                    flex: 1, padding: "7px 0",
                    background: "#111", border: "1px solid #1A1A1A",
                    color: "#888", cursor: "pointer", fontSize: 10,
                    fontWeight: 700, letterSpacing: "0.14em",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                    fontFamily: "'Inter', sans-serif",
                  }}>
                    TAKE <span style={{ color: "#3A3A3A", fontSize: 11, marginTop: -1 }}>↵</span>
                  </button>
                  {/* CUT */}
                  <button
                    onClick={() => void allOut()}
                    style={{
                      flex: 1, padding: "7px 0",
                      background: "#111", border: "1px solid #1A1A1A",
                      color: "#555", cursor: "pointer", fontSize: 10,
                      fontWeight: 700, letterSpacing: "0.1em",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    CUT <span style={{ color: "#333", fontSize: 9 }}>· Esc</span>
                  </button>
                </div>
                {/* ALL OUT */}
                <button
                  onClick={() => void allOut()}
                  style={{
                    width: "100%", padding: "7px 0",
                    background: "#111", border: "1px solid #1A1A1A",
                    color: "#3A3A3A", cursor: "pointer", fontSize: 10,
                    fontWeight: 700, letterSpacing: "0.16em",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  ALL OUT <span style={{ fontSize: 9, color: "#252525" }}>· ⌘Esc</span>
                </button>
              </div>
            </div>
          </div>

          {/* Panel content area */}
          <div style={{ flex: 1, overflowY: "auto", background: "#0A0A0A" }}>
            <PlaceholderPanel item={activeItem} />
          </div>
        </main>
      </div>
    </div>
  );
}
