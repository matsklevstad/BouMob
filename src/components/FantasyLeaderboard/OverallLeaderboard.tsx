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
        }
        .subtitle {
          text-align: center;
          color: #888;
          margin-bottom: 1.5rem;
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
          color: #333;
        }
        .leaderboard-table tr:not(:last-child) {
          border-bottom: 1px solid #eee;
        }
        .leaderboard-table tr.top-1 {
          background: #fff8e1;
        }
        .leaderboard-table tr.top-2 {
          background: #f5f5f5;
        }
        .leaderboard-table tr.top-3 {
          background: #fff3e0;
        }
        .rank {
          font-size: 1.5rem;
          text-align: center;
          width: 80px;
        }
        .team-name {
          font-weight: 600;
          color: #333;
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
        .view-btn {
          padding: 0.5rem 1rem;
          background: #2196f3;
          color: white;
          border: none;
          border-radius: 4px;
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
          color: #666;
        }
      `}</style>
    </div>
  );
}
