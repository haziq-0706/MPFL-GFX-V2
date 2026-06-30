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
  home_team?: string;
  away_team?: string;
  competition?: string;
  venue?: string;
}

export interface MatchIdData {
  home_code: string;
  away_code: string;
  competition?: string;
  venue?: string;
  kickoff?: string;
}

export interface StandingsRow {
  pos: number;
  code: string;
  name: string;
  p: number;
  w: number;
  d: number;
  l: number;
  gd: number;
  pts: number;
}

export interface TableData {
  title?: string;
  rows: StandingsRow[];
}

export interface CircuitGame {
  home_code: string;
  away_code: string;
  home_score?: number;
  away_score?: number;
  played: boolean;
  time?: string;
}

export interface CircuitData {
  round: string;
  games: CircuitGame[];
}

export interface LineupPlayer {
  number: number | string;
  name: string;
}

export interface LineupData {
  team_code: string;
  players: LineupPlayer[];
  revealed: number;
}
