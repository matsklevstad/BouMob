import type { NextApiRequest, NextApiResponse } from "next";
import { createSupabaseServerClient } from "@/lib/supabase/api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const supabase = createSupabaseServerClient(req, res);

  // Check authentication
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method === "GET") {
    try {
      const { gameweek_id } = req.query;

      // Get user profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("auth_user_id", session.user.id)
        .single();

      if (!profile) {
        return res.status(404).json({ error: "Profile not found" });
      }

      let query = supabase
        .from("fantasy_picks")
        .select("*, gameweek:gameweek_id(*)")
        .eq("profile_id", profile.id);

      if (gameweek_id) {
        query = query.eq("gameweek_id", gameweek_id);
      }

      const { data: picks, error } = await query;

      if (error) throw error;
      return res.status(200).json(picks);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === "POST") {
    try {
      const {
        gameweek_id,
        player_1_id,
        player_2_id,
        player_3_id,
        player_4_id,
        captain_player_id,
      } = req.body;

      // Get user profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("auth_user_id", session.user.id)
        .single();

      if (!profile) {
        return res.status(404).json({ error: "Profile not found" });
      }

      // Check if gameweek exists and deadline hasn't passed
      const { data: gameweek, error: gameweekError } = await supabase
        .from("gameweeks")
        .select("*")
        .eq("id", gameweek_id)
        .single();

      if (gameweekError) throw gameweekError;

      const now = new Date();
      const deadline = new Date(gameweek.deadline_at);

      if (now > deadline) {
        return res
          .status(400)
          .json({ error: "Deadline has passed for this gameweek" });
      }

      // Validate that we have 4 unique players
      const playerIds = [player_1_id, player_2_id, player_3_id, player_4_id];
      const uniquePlayerIds = new Set(playerIds);

      if (uniquePlayerIds.size !== 4) {
        return res
          .status(400)
          .json({ error: "You must select 4 different players" });
      }

      // Validate captain is one of the selected players
      if (!playerIds.includes(captain_player_id)) {
        return res
          .status(400)
          .json({ error: "Captain must be one of your selected players" });
      }

      // Get player prices
      const { data: players, error: playersError } = await supabase
        .from("player")
        .select("id, price")
        .in("id", playerIds);

      if (playersError) throw playersError;

      // Calculate total cost
      const totalCost = players.reduce(
        (sum, player) => sum + (player.price || 0),
        0,
      );

      if (totalCost > 20) {
        return res.status(400).json({
          error: `Total cost (${totalCost}M) exceeds budget of 20M`,
        });
      }

      // Upsert the pick
      const { data: pick, error } = await supabase
        .from("fantasy_picks")
        .upsert(
          {
            profile_id: profile.id,
            gameweek_id,
            player_1_id,
            player_2_id,
            player_3_id,
            player_4_id,
            captain_player_id,
          },
          { onConflict: "profile_id,gameweek_id" },
        )
        .select()
        .single();

      if (error) throw error;
      return res.status(200).json(pick);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
