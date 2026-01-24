import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../../contexts/AuthContext";
import { Gameweek } from "../../types/Gameweek";
import { Player } from "../../types/Player";

interface PlayerStat {
  player_id: number;
  played: boolean;
  goals: number;
  assists: number;
  yellow_cards: number;
  red_cards: number;
}

export default function AdminMatchStatsPage() {
  const { profile, loading: authLoading } = useAuth();
  const router = useRouter();
  const [gameweeks, setGameweeks] = useState<Gameweek[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedGameweek, setSelectedGameweek] = useState<number | null>(null);
  const [stats, setStats] = useState<Record<number, PlayerStat>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && (!profile || !profile.is_admin)) {
      router.push("/fantasy");
    }
  }, [profile, authLoading, router]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [gameweeksRes, playersRes] = await Promise.all([
        fetch("/api/admin/gameweeks"),
        fetch("/api/admin/players"),
      ]);

      const gameweeksData = await gameweeksRes.json();
      const playersData = await playersRes.json();

      setGameweeks(gameweeksData);
      setPlayers(playersData);

      // Initialize stats for all players
      const initialStats: Record<number, PlayerStat> = {};
      playersData.forEach((player: Player) => {
        initialStats[player.id] = {
          player_id: player.id,
          played: false,
          goals: 0,
          assists: 0,
          yellow_cards: 0,
          red_cards: 0,
        };
      });
      setStats(initialStats);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStat = (
    playerId: number,
    field: keyof PlayerStat,
    value: any,
  ) => {
    setStats({
      ...stats,
      [playerId]: {
        ...stats[playerId],
        [field]: value,
      },
    });
  };

  const handleSave = async () => {
    if (!selectedGameweek) {
      alert("Please select a gameweek");
      return;
    }

    setSaving(true);
    try {
      const statsArray = Object.values(stats).filter((stat) => stat.played);

      const response = await fetch("/api/admin/match-stats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameweek_id: selectedGameweek,
          stats: statsArray,
        }),
      });

      if (!response.ok) throw new Error("Failed to save stats");

      alert("Stats saved and points calculated successfully!");
    } catch (error: any) {
      alert("Error saving stats: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="admin-page">
      <h1>Enter Match Stats</h1>

      <div className="gameweek-selector">
        <label>Select Gameweek:</label>
        <select
          value={selectedGameweek || ""}
          onChange={(e) => setSelectedGameweek(Number(e.target.value))}
        >
          <option value="">-- Select Gameweek --</option>
          {gameweeks.map((gw) => (
            <option key={gw.id} value={gw.id}>
              {gw.round_name} ({new Date(gw.match_date).toLocaleDateString()})
            </option>
          ))}
        </select>
      </div>

      {selectedGameweek && (
        <>
          <div className="stats-table-container">
            <table className="stats-table">
              <thead>
                <tr>
                  <th>Player</th>
                  <th>Played</th>
                  <th>Goals</th>
                  <th>Assists</th>
                  <th>Yellow Cards</th>
                  <th>Red Cards</th>
                </tr>
              </thead>
              <tbody>
                {players.map((player) => (
                  <tr key={player.id}>
                    <td className="player-name">
                      {player.first_name} {player.last_name}
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={stats[player.id]?.played || false}
                        onChange={(e) =>
                          updateStat(player.id, "played", e.target.checked)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        value={stats[player.id]?.goals || 0}
                        onChange={(e) =>
                          updateStat(player.id, "goals", Number(e.target.value))
                        }
                        disabled={!stats[player.id]?.played}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        value={stats[player.id]?.assists || 0}
                        onChange={(e) =>
                          updateStat(
                            player.id,
                            "assists",
                            Number(e.target.value),
                          )
                        }
                        disabled={!stats[player.id]?.played}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        max="2"
                        value={stats[player.id]?.yellow_cards || 0}
                        onChange={(e) =>
                          updateStat(
                            player.id,
                            "yellow_cards",
                            Number(e.target.value),
                          )
                        }
                        disabled={!stats[player.id]?.played}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        max="1"
                        value={stats[player.id]?.red_cards || 0}
                        onChange={(e) =>
                          updateStat(
                            player.id,
                            "red_cards",
                            Number(e.target.value),
                          )
                        }
                        disabled={!stats[player.id]?.played}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="save-button"
          >
            {saving ? "Saving..." : "Save Stats & Calculate Points"}
          </button>
        </>
      )}

      <style jsx>{`
        .admin-page {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        h1 {
          margin-bottom: 2rem;
        }
        .gameweek-selector {
          margin-bottom: 2rem;
          padding: 1.5rem;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .gameweek-selector label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
        }
        .gameweek-selector select {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
        }
        .stats-table-container {
          background: white;
          border-radius: 8px;
          overflow-x: auto;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          margin-bottom: 2rem;
        }
        .stats-table {
          width: 100%;
          border-collapse: collapse;
        }
        .stats-table th,
        .stats-table td {
          padding: 1rem;
          text-align: left;
          border-bottom: 1px solid #eee;
        }
        .stats-table th {
          background: #f5f5f5;
          font-weight: 600;
        }
        .player-name {
          font-weight: 500;
        }
        .stats-table input[type="number"] {
          width: 60px;
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          text-align: center;
        }
        .stats-table input[type="checkbox"] {
          width: 20px;
          height: 20px;
          cursor: pointer;
        }
        .stats-table input:disabled {
          background: #f5f5f5;
          cursor: not-allowed;
        }
        .save-button {
          width: 100%;
          padding: 1rem;
          background: #4caf50;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
        }
        .save-button:hover:not(:disabled) {
          background: #45a049;
        }
        .save-button:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
        .loading {
          text-align: center;
          padding: 2rem;
        }
      `}</style>
    </div>
  );
}
