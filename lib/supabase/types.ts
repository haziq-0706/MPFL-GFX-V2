export type MatchStatus = "pre" | "live" | "ht" | "ft";
export type OverlayType = "countdown" | "matchid" | "table" | "circuit" | "lineup" | null;

export interface Match {
  id: string;
  home_team: string;
  away_team: string;
  home_score: number;
  away_score: number;
  match_time: string;
  status: MatchStatus;
  venue: string | null;
  competition: string | null;
  created_at: string;
  updated_at: string;
}

export interface BroadcastState {
  id: string;
  match_id: string | null;
  active_overlay: OverlayType;
  overlay_data: Record<string, unknown>;
  is_live: boolean;
  updated_at: string;
}

export interface CountdownData {
  target_time: number;
  label: string;
  home_code?: string;
  away_code?: string;
  home_team?: string;
  away_team?: string;
  competition?: string;
  venue?: string;
  match_date?: string;    // e.g. "SAT 14 FEB"
  kickoff_time?: string;  // e.g. "20:00 MYT"
}

export interface MatchIdData {
  home_code: string;
  away_code: string;
  competition?: string;  // e.g. "MPFL 2026 · CIRCUIT 3"
  matchday?: string;     // e.g. "MATCHDAY"
  venue?: string;
  match_date?: string;   // e.g. "SAT 14 FEB"
  kickoff?: string;      // e.g. "20:00 MYT"
}

export type FormResult = "W" | "D" | "L";

export interface StandingsRow {
  pos: number;
  code: string;
  name: string;
  p: number;
  w: number;
  d: number;
  l: number;
  gf: number;
  ga: number;
  gd: number;
  pts: number;
  form?: FormResult[];
}

export interface TableData {
  title?: string;
  season?: string;   // e.g. "MPFL 2026 · LEAGUE"
  rows: StandingsRow[];
}

export interface CircuitGame {
  home_code: string;
  away_code: string;
  home_score?: number;
  away_score?: number;
  status: "ft" | "live" | "upcoming";
  time?: string;         // kickoff time for upcoming, e.g. "17:30"
  live_minute?: string;  // e.g. "14"
  court?: string;        // e.g. "COURT A"
}

export interface CircuitData {
  round: string;         // e.g. "CIRCUIT 3"
  venue?: string;        // e.g. "AXIATA ARENA, KUALA LUMPUR"
  date_range?: string;   // e.g. "SAT-SUN · 14-15 FEB 2026"
  games: CircuitGame[];
}

export type LineupPosition = "GK" | "ALA" | "FIXO" | "PIVO" | "COACH";

export interface LineupPlayer {
  number: number | string;
  name: string;
  position?: LineupPosition;
}

export interface LineupData {
  team_code: string;
  players: LineupPlayer[];
  revealed: number;
}
