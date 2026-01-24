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
      .from("fantasy_scores")
      .select("*")
      .eq("profile_id", profile_id)
      .eq("gameweek_id", gameweek_id)
      .single();

    if (error) throw error;
    return res.status(200).json(data);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
