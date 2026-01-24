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

  // Check if user is admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("auth_user_id", session.user.id)
    .single();

  if (!profile || !profile.is_admin) {
    return res.status(403).json({ error: "Forbidden: Admin access required" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { gameweek_id } = req.body;

    if (!gameweek_id) {
      return res.status(400).json({ error: "gameweek_id is required" });
    }

    // Get all fantasy picks for this gameweek
    const { data: picks, error: picksError } = await supabase
      .from("fantasy_picks")
      .select("*")
      .eq("gameweek_id", gameweek_id);

    if (picksError) throw picksError;

    // Get all player match stats for this gameweek
    const { data: stats, error: statsError } = await supabase
      .from("player_match_stats")
      .select("*")
      .eq("gameweek_id", gameweek_id);

    if (statsError) throw statsError;

    // Create a map of player_id to stats for quick lookup
    const statsMap = new Map();
    stats?.forEach((stat) => {
      statsMap.set(stat.player_id, stat);
    });

    // Calculate points for each pick
    const scores = picks?.map((pick) => {
      const calculatePlayerPoints = (playerId: number) => {
        const stat = statsMap.get(playerId);
        if (!stat || !stat.played) return 0;

        let points = 0;

        // Goals: +5 points each
        points += (stat.goals || 0) * 5;

        // Assists: +3 points each
        points += (stat.assists || 0) * 3;

        // Yellow cards: -1 point each
        points -= (stat.yellow_cards || 0) * 1;

        // Red cards: -3 points each
        points -= (stat.red_cards || 0) * 3;

        return points;
      };

      const player1Points = calculatePlayerPoints(pick.player_1_id);
      const player2Points = calculatePlayerPoints(pick.player_2_id);
      const player3Points = calculatePlayerPoints(pick.player_3_id);
      const player4Points = calculatePlayerPoints(pick.player_4_id);

      // Captain gets double points
      let captainBonus = 0;
      if (pick.captain_player_id === pick.player_1_id) {
        captainBonus = player1Points;
      } else if (pick.captain_player_id === pick.player_2_id) {
        captainBonus = player2Points;
      } else if (pick.captain_player_id === pick.player_3_id) {
        captainBonus = player3Points;
      } else if (pick.captain_player_id === pick.player_4_id) {
        captainBonus = player4Points;
      }

      const totalPoints =
        player1Points +
        player2Points +
        player3Points +
        player4Points +
        captainBonus;

      return {
        profile_id: pick.profile_id,
        gameweek_id: pick.gameweek_id,
        player_1_points: player1Points,
        player_2_points: player2Points,
        player_3_points: player3Points,
        player_4_points: player4Points,
        captain_bonus: captainBonus,
        total_points: totalPoints,
      };
    });

    // Upsert scores
    const { data: insertedScores, error: scoresError } = await supabase
      .from("fantasy_scores")
      .upsert(scores, { onConflict: "profile_id,gameweek_id" })
      .select();

    if (scoresError) throw scoresError;

    // Create 0-point entries for users who didn't pick
    const { data: allProfiles } = await supabase.from("profiles").select("id");

    const profilesWithPicks = new Set(picks?.map((p) => p.profile_id));
    const profilesWithoutPicks =
      allProfiles?.filter((p) => !profilesWithPicks.has(p.id)) || [];

    if (profilesWithoutPicks.length > 0) {
      const zeroScores = profilesWithoutPicks.map((p) => ({
        profile_id: p.id,
        gameweek_id,
        player_1_points: 0,
        player_2_points: 0,
        player_3_points: 0,
        player_4_points: 0,
        captain_bonus: 0,
        total_points: 0,
      }));

      await supabase
        .from("fantasy_scores")
        .upsert(zeroScores, { onConflict: "profile_id,gameweek_id" });
    }

    return res.status(200).json({
      success: true,
      scores: insertedScores,
      message: `Calculated points for ${picks?.length || 0} teams`,
    });
  } catch (error: any) {
    console.error("Error calculating points:", error);
    return res.status(500).json({ error: error.message });
  }
}
