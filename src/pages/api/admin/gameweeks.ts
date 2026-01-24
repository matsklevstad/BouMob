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
      const { data: gameweeks, error } = await supabase
        .from("gameweeks")
        .select("*")
        .order("round_number", { ascending: false });

      if (error) throw error;
      return res.status(200).json(gameweeks);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === "POST") {
    try {
      const { data: gameweek, error } = await supabase
        .from("gameweeks")
        .insert(req.body)
        .select()
        .single();

      if (error) throw error;
      return res.status(201).json(gameweek);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === "PUT") {
    try {
      const { id, ...updates } = req.body;
      const { data: gameweek, error } = await supabase
        .from("gameweeks")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return res.status(200).json(gameweek);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === "DELETE") {
    try {
      const { id } = req.query;
      const { error } = await supabase.from("gameweeks").delete().eq("id", id);

      if (error) throw error;
      return res.status(200).json({ success: true });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
