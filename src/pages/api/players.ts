import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabase/server";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    try {
      const { data: players, error } = await supabase
        .from("player")
        .select("*")
        .order("price", { ascending: false });

      if (error) throw error;

      return res.status(200).json(players);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
