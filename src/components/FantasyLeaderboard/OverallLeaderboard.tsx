import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { LeaderboardEntry } from "../../types/FantasyScore";
import { Gameweek } from "../../types/Gameweek";

interface OverallLeaderboardProps {
  refreshKey?: number;
}

export default function OverallLeaderboard({
  refreshKey,
}: OverallLeaderboardProps) {
  const router = useRouter();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [gameweeks, setGameweeks] = useState<Gameweek[]>([]);
  const [selectedGameweek, setSelectedGameweek] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
    fetchGameweeks();
  }, [refreshKey]);

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
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch("/api/fantasy/leaderboard");
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
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading leaderboard...</div>;
  }

  if (leaderboard.length === 0) {
    return (
      <div className="no-data">
        <p>No scores yet. Start playing to see the leaderboard!</p>
      </div>
    );
  }

  return (
    <div className="leaderboard">
      <h2>Overall Leaderboard</h2>
      <p className="subtitle">Total points across all gameweeks</p>
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Team</th>
            <th>Manager</th>
            <th>Points</th>
            <th>View</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((entry) => (
            <tr
              key={entry.profile_id}
              className={entry.rank <= 3 ? `top-${entry.rank}` : ""}
            >
              <td className="rank">
                {entry.rank === 1 && "🥇"}
                {entry.rank === 2 && "🥈"}
                {entry.rank === 3 && "🥉"}
                {entry.rank > 3 && entry.rank}
              </td>
              <td className="team-name">{entry.team_name || "Unnamed Team"}</td>
              <td className="username">{entry.username || "Anonymous"}</td>
              <td className="points">{entry.total_points}</td>
              <td>
                {selectedGameweek && (
                  <button
                    className="view-btn"
                    onClick={() =>
                      router.push(
                        `/team/${entry.profile_id}/${selectedGameweek}`,
                      )
                    }
                  >
                    View Team
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <style jsx>{`
        .leaderboard {
          padding: 2rem;
          max-width: 900px;
          margin: 0 auto;
        }
        h2 {
          margin-bottom: 0.5rem;
          text-align: center;
          color: white;
        }
        .subtitle {
          text-align: center;
          color: gray;
          margin-bottom: 1.5rem;
        }
        .leaderboard-table {
          width: 100%;
          background: #1a1a1a;
          border: 2px solid #2a2a2a;
          border-radius: 12px;
          overflow: hidden;
        }
        .leaderboard-table th,
        .leaderboard-table td {
          padding: 1rem;
          text-align: left;
          color: white;
        }
        .leaderboard-table th {
          background: #2a2a2a;
          font-weight: 600;
        }
        .leaderboard-table tr:not(:last-child) {
          border-bottom: 1px solid #2a2a2a;
        }
        .leaderboard-table tr.top-1 {
          background: #2a2a1a;
        }
        .leaderboard-table tr.top-2 {
          background: #1a1a1a;
        }
        .leaderboard-table tr.top-3 {
          background: #2a2a1a;
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
          color: gray;
        }
        .points {
          font-weight: bold;
          color: #5dbc6f;
          font-size: 1.2rem;
          text-align: right;
        }
        .view-btn {
          padding: 0.5rem 1rem;
          background: #2196f3;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.85rem;
          transition: background 0.2s;
        }
        .view-btn:hover {
          background: #1976d2;
        }
        .loading,
        .no-data {
          text-align: center;
          padding: 2rem;
          color: gray;
        }
      `}</style>
    </div>
  );
}
