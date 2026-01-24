export interface Player {
  id: number;
  created_at: string;
  first_name: string | null;
  last_name: string | null;
  birthdate: string | null;
  nationality: string | null;
  city: string | null;
  photo_url: string | null;
  height: number | null;
  is_right_foot: boolean;
  price: number | null;
  position: string | null;
}

export interface PlayerMatchStats {
  id: number;
  player_id: number;
  gameweek_id: number | null;
  played: boolean | null;
  goals: number | null;
  assists: number | null;
  clean_sheet: boolean | null;
  was_goalkeeper: boolean | null;
  yellow_cards?: number | null;
  red_cards?: number | null;
}
