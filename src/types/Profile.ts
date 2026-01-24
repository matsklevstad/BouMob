export interface Profile {
  id: number;
  created_at: string;
  username: string | null;
  team_name: string | null;
  avatar_url: string | null;
  auth_user_id: string | null;
  is_admin: boolean;
}
