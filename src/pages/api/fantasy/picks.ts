import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabase/server";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { profile_id, gameweek_id } = req.query;

  if (!profile_id || !gameweek_id) {
    return res
      .status(400)
      .json({ error: "profile_id and gameweek_id are required" });
  }

  try {
    const { data, error } = await supabase
      .from("fantasy_picks")
      .select(
        `
        *,
        profile:profile_id(username, team_name),
        player_1:player_1_id(*),
        player_2:player_2_id(*),
        player_3:player_3_id(*),
        player_4:player_4_id(*)
      `,
      )
      .eq("profile_id", profile_id)
      .eq("gameweek_id", gameweek_id)
      .single();

    if (error) throw error;

    // Handle Supabase joins that return arrays
    const normalizedData = {
      ...data,
      profile: Array.isArray(data.profile) ? data.profile[0] : data.profile,
      player_1: Array.isArray(data.player_1) ? data.player_1[0] : data.player_1,
      player_2: Array.isArray(data.player_2) ? data.player_2[0] : data.player_2,
      player_3: Array.isArray(data.player_3) ? data.player_3[0] : data.player_3,
      player_4: Array.isArray(data.player_4) ? data.player_4[0] : data.player_4,
    };

    return res.status(200).json(normalizedData);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
