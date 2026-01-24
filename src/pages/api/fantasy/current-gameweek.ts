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
    const now = new Date().toISOString();

    // Get the current or upcoming gameweek
    const { data: gameweek, error } = await supabase
      .from("gameweeks")
      .select("*")
      .gte("deadline_at", now)
      .eq("is_completed", false)
      .order("deadline_at", { ascending: true })
      .limit(1)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 = no rows returned
      throw error;
    }

    return res.status(200).json(gameweek || null);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
