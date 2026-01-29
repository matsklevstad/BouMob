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

  if (req.method === "GET") {
    try {
      const { gameweek_id } = req.query;

      let query = supabase
        .from("player_match_stats")
        .select("*, player:player_id(*)");

      if (gameweek_id) {
        query = query.eq("gameweek_id", gameweek_id);
      }

      const { data: stats, error } = await query.order("id", {
        ascending: false,
      });

      if (error) throw error;
      return res.status(200).json(stats);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === "POST") {
    try {
      const { gameweek_id, stats } = req.body;

      // Delete existing stats for this gameweek to allow re-entry
      await supabase
        .from("player_match_stats")
        .delete()
        .eq("gameweek_id", gameweek_id);

      // Insert new stats
      const statsToInsert = stats.map((stat: any) => ({
        ...stat,
        gameweek_id,
      }));

      const { data, error } = await supabase
        .from("player_match_stats")
        .insert(statsToInsert)
        .select();

      if (error) throw error;

      // Trigger points calculation
      const calculateResponse = await fetch(
        `${req.headers.origin}/api/admin/calculate-points`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie: req.headers.cookie || "",
          },
          body: JSON.stringify({ gameweek_id }),
        },
      );

      if (!calculateResponse.ok) {
        console.error("Points calculation failed");
      }

      return res.status(201).json(data);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
