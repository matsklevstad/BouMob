export interface FantasyPick {
  id: number;
  profile_id: number;
  gameweek_id: number;
  player_1_id: number;
  player_2_id: number;
  player_3_id: number;
  player_4_id: number;
  captain_player_id: number;
  created_at: string;
}

export interface FantasyPickWithDetails extends FantasyPick {
  player_1?: any;
  player_2?: any;
  player_3?: any;
  player_4?: any;
  captain?: any;
}
