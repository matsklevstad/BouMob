export interface FantasyScore {
  id: number;
  profile_id: number;
  gameweek_id: number;
  player_1_points: number;
  player_2_points: number;
  player_3_points: number;
  player_4_points: number;
  captain_bonus: number;
  total_points: number;
  created_at: string;
  updated_at: string;
}

export interface LeaderboardEntry {
  rank: number;
  profile_id: number;
  username: string | null;
  team_name: string | null;
  avatar_url: string | null;
  total_points: number;
  gameweek_points?: number;
}
