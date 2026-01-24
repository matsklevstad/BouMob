import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabase/server";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { gameweek_id } = req.query;

    let query = supabase
      .from("fantasy_scores")
      .select("*, profile:profile_id(username, team_name, avatar_url)");

    if (gameweek_id) {
      // Gameweek leaderboard
      const { data: scores, error } = await query
        .eq("gameweek_id", gameweek_id)
        .order("total_points", { ascending: false });

      if (error) throw error;

      const leaderboard = scores?.map((score: any, index) => {
        const profile = Array.isArray(score.profile)
          ? score.profile[0]
          : score.profile;
        return {
          rank: index + 1,
          profile_id: score.profile_id,
          username: profile?.username,
          team_name: profile?.team_name,
          avatar_url: profile?.avatar_url,
          gameweek_points: score.total_points,
          total_points: score.total_points,
        };
      });

      return res.status(200).json(leaderboard);
    } else {
      // Overall leaderboard - sum all gameweeks
      const { data: scores, error } = await supabase
        .from("fantasy_scores")
        .select(
          "profile_id, total_points, profile:profile_id(username, team_name, avatar_url)",
        );

      if (error) throw error;

      // Group by profile and sum points
      const profileScores = new Map();
      scores?.forEach((score: any) => {
        const profile = Array.isArray(score.profile)
          ? score.profile[0]
          : score.profile;
        const current = profileScores.get(score.profile_id) || {
          profile_id: score.profile_id,
          username: profile?.username,
          team_name: profile?.team_name,
          avatar_url: profile?.avatar_url,
          total_points: 0,
        };
        current.total_points += score.total_points;
        profileScores.set(score.profile_id, current);
      });

      // Convert to array and sort
      const leaderboard = Array.from(profileScores.values())
        .sort((a: any, b: any) => b.total_points - a.total_points)
        .map((entry, index) => ({
          rank: index + 1,
          ...entry,
        }));

      return res.status(200).json(leaderboard);
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
