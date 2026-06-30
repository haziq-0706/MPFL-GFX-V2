export type MatchStatus = "pre" | "live" | "ht" | "ft";
export type OverlayType = "scoreboard" | "lower_third" | "lineup" | "full_screen" | null;

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

export interface Database {
  public: {
    Tables: {
      matches: {
        Row: Match;
        Insert: Partial<Match>;
        Update: Partial<Match>;
      };
      broadcast_state: {
        Row: BroadcastState;
        Insert: Partial<BroadcastState>;
        Update: Partial<BroadcastState>;
      };
    };
  };
}
