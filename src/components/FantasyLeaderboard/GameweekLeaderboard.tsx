import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { LeaderboardEntry } from "../../types/FantasyScore";
import { Gameweek } from "../../types/Gameweek";

export default function GameweekLeaderboard() {
  const router = useRouter();
  const [gameweeks, setGameweeks] = useState<Gameweek[]>([]);
  const [selectedGameweek, setSelectedGameweek] = useState<number | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGameweeks();
  }, []);

  useEffect(() => {
    if (selectedGameweek) {
      fetchLeaderboard();
    }
  }, [selectedGameweek]);

  const fetchGameweeks = async () => {
    try {
      const response = await fetch("/api/admin/gameweeks");
      const data = await response.json();
      const completed = data.filter((gw: Gameweek) => gw.is_completed);
      setGameweeks(completed);
      if (completed.length > 0) {
        setSelectedGameweek(completed[0].id);
      }
    } catch (error) {
      console.error("Error fetching gameweeks:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaderboard = async () => {
    if (!selectedGameweek) return;

    try {
      const response = await fetch(
        `/api/fantasy/leaderboard?gameweek_id=${selectedGameweek}`,
      );
      const data = await response.json();

      // Check if response is an array, otherwise set empty array
      if (Array.isArray(data)) {
        setLeaderboard(data);
      } else {
        console.error("Invalid leaderboard data:", data);
        setLeaderboard([]);
      }
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      setLeaderboard([]);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (gameweeks.length === 0) {
    return (
      <div className="no-data">
        <p>No completed gameweeks yet.</p>
      </div>
    );
  }

  return (
    <div className="gameweek-leaderboard">
      <h2>Gameweek Winners</h2>

      <div className="gameweek-selector">
        <label>Select Gameweek:</label>
        <select
          value={selectedGameweek || ""}
          onChange={(e) => setSelectedGameweek(Number(e.target.value))}
        >
          {gameweeks.map((gw) => (
            <option key={gw.id} value={gw.id}>
              {gw.round_name} ({new Date(gw.match_date).toLocaleDateString()})
            </option>
          ))}
        </select>
      </div>

      {leaderboard.length > 0 ? (
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Team</th>
              <th>Manager</th>
              <th>GW Points</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry) => (
              <tr
                key={entry.profile_id}
                className={entry.rank === 1 ? "winner" : ""}
                onClick={() =>
                  router.push(`/team/${entry.profile_id}/${selectedGameweek}`)
                }
                style={{ cursor: "pointer" }}
              >
                <td className="rank">
                  {entry.rank === 1 && "👑"}
                  {entry.rank > 1 && entry.rank}
                </td>
                <td className="team-name">
                  {entry.team_name || "Unnamed Team"}
                </td>
                <td className="username">{entry.username || "Anonymous"}</td>
                <td className="points">{entry.gameweek_points || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="no-data">
          <p>No scores for this gameweek yet.</p>
        </div>
      )}

      <style jsx>{`
        .gameweek-leaderboard {
          padding: 2rem;
          max-width: 800px;
          margin: 0 auto;
        }
        h2 {
          margin-bottom: 1.5rem;
          text-align: center;
        }
        .gameweek-selector {
          margin-bottom: 2rem;
          text-align: center;
        }
        .gameweek-selector label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
        }
        .gameweek-selector select {
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
          min-width: 300px;
        }
        .leaderboard-table {
          width: 100%;
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .leaderboard-table th,
        .leaderboard-table td {
          padding: 1rem;
          text-align: left;
        }
        .leaderboard-table th {
          background: #f5f5f5;
          font-weight: 600;
        }
        .leaderboard-table tr:not(:last-child) {
          border-bottom: 1px solid #eee;
        }
        .leaderboard-table tr.winner {
          background: linear-gradient(135deg, #fff8e1 0%, #ffe082 100%);
        }
        .rank {
          font-size: 1.5rem;
          text-align: center;
          width: 80px;
        }
        .team-name {
          font-weight: 600;
        }
        .username {
          color: #666;
        }
        .points {
          font-weight: bold;
          color: #4caf50;
          font-size: 1.2rem;
          text-align: right;
        }
        .loading,
        .no-data {
          text-align: center;
          padding: 2rem;
          color: #666;
        }
      `}</style>
    </div>
  );
}
