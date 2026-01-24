import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Header from "@/components/Header";

export default function TeamView() {
  const router = useRouter();
  const { profileId, gameweekId } = router.query;
  const [team, setTeam] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (profileId && gameweekId) {
      fetchTeam();
    }
  }, [profileId, gameweekId]);

  const fetchTeam = async () => {
    try {
      setLoading(true);
      setError(null);

      const [picksRes, scoresRes, gwRes] = await Promise.all([
        fetch(
          `/api/fantasy/picks?profile_id=${profileId}&gameweek_id=${gameweekId}`,
        ),
        fetch(
          `/api/fantasy/scores?profile_id=${profileId}&gameweek_id=${gameweekId}`,
        ),
        fetch(`/api/admin/gameweeks`),
      ]);

      const picks = await picksRes.json();
      const scores = await scoresRes.json();
      const gameweeks = await gwRes.json();

      if (picks.error || scores.error) {
        throw new Error(picks.error || scores.error);
      }

      const gameweek = Array.isArray(gameweeks)
        ? gameweeks.find((gw: any) => gw.id === parseInt(gameweekId as string))
        : null;

      setTeam({ picks, scores, gameweek });
    } catch (err: any) {
      console.error("Error fetching team:", err);
      setError(err.message || "Failed to load team");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="container">
          <div className="loading">Loading team...</div>
        </div>
        <style jsx>{`
          .container {
            padding: 2rem;
            text-align: center;
          }
          .loading {
            font-size: 1.2rem;
            color: #888;
          }
        `}</style>
      </>
    );
  }

  if (error || !team) {
    return (
      <>
        <Header />
        <div className="container">
          <div className="error">
            <h2>Team not found</h2>
            <p>{error || "No data available"}</p>
            <button
              onClick={() => router.push("/leaderboard")}
              className="back-btn"
            >
              Back to Leaderboard
            </button>
          </div>
        </div>
        <style jsx>{`
          .container {
            padding: 2rem;
            text-align: center;
          }
          .error {
            max-width: 500px;
            margin: 2rem auto;
          }
          .error h2 {
            color: #f44336;
            margin-bottom: 1rem;
          }
          .error p {
            color: #888;
            margin-bottom: 1.5rem;
          }
          .back-btn {
            padding: 0.75rem 1.5rem;
            background: #4caf50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 1rem;
          }
          .back-btn:hover {
            background: #45a049;
          }
        `}</style>
      </>
    );
  }

  const { picks, scores, gameweek } = team;
  const players = [
    {
      id: picks.player_1_id,
      player: picks.player_1,
      points: scores.player_1_points,
    },
    {
      id: picks.player_2_id,
      player: picks.player_2,
      points: scores.player_2_points,
    },
    {
      id: picks.player_3_id,
      player: picks.player_3,
      points: scores.player_3_points,
    },
    {
      id: picks.player_4_id,
      player: picks.player_4,
      points: scores.player_4_points,
    },
  ];

  return (
    <>
      <Header />
      <div className="team-view">
        <button onClick={() => router.back()} className="back-link">
          ← Back
        </button>

        <div className="header-section">
          <h1>{picks.profile?.team_name || "Team"}</h1>
          <p className="manager">
            Manager: {picks.profile?.username || "Unknown"}
          </p>
          {gameweek && (
            <h3>
              Gameweek {gameweek.round_number} - {gameweek.round_name}
            </h3>
          )}
          <div className="total-points">{scores.total_points} points</div>
        </div>

        <div className="pitch">
          <div className="players-grid">
            {players.map((p) => {
              const isCaptain = picks.captain_player_id === p.id;
              return (
                <div
                  key={p.id}
                  className={`player-card ${isCaptain ? "captain" : ""}`}
                >
                  {isCaptain && <div className="captain-badge">C</div>}
                  <div className="player-image">
                    {p.player?.photo_url ? (
                      <img src={p.player.photo_url} alt={p.player.last_name} />
                    ) : (
                      <div className="player-placeholder">
                        {p.player?.first_name?.[0]}
                        {p.player?.last_name?.[0]}
                      </div>
                    )}
                  </div>
                  <div className="player-info">
                    <div className="player-name">
                      {p.player?.last_name || "Unknown"}
                    </div>
                    <div className="player-points">{p.points} pts</div>
                    {isCaptain && (
                      <div className="captain-bonus">+{p.points} bonus</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="breakdown">
          <h3>Points Breakdown</h3>
          <table>
            <tbody>
              {players.map((p, idx) => (
                <tr key={p.id}>
                  <td>
                    {p.player?.first_name} {p.player?.last_name}
                  </td>
                  <td className="points">{p.points}</td>
                </tr>
              ))}
              {scores.captain_bonus > 0 && (
                <tr className="captain-row">
                  <td>Captain Bonus</td>
                  <td className="points">+{scores.captain_bonus}</td>
                </tr>
              )}
              <tr className="total-row">
                <td>
                  <strong>Total</strong>
                </td>
                <td className="points">
                  <strong>{scores.total_points}</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <style jsx>{`
          .team-view {
            padding: 2rem;
            max-width: 900px;
            margin: 0 auto;
          }
          .back-link {
            display: inline-block;
            margin-bottom: 1.5rem;
            padding: 0.5rem 1rem;
            background: #333;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.9rem;
          }
          .back-link:hover {
            background: #444;
          }
          .header-section {
            text-align: center;
            margin-bottom: 2rem;
            padding: 1.5rem;
            background: #1a1a1a;
            border-radius: 8px;
          }
          h1 {
            margin: 0 0 0.5rem 0;
            font-size: 2rem;
          }
          .manager {
            color: #888;
            margin: 0 0 1rem 0;
          }
          h3 {
            color: #aaa;
            margin: 0 0 1rem 0;
            font-size: 1.1rem;
          }
          .total-points {
            font-size: 2.5rem;
            font-weight: bold;
            color: #4caf50;
            margin-top: 1rem;
          }
          .pitch {
            background: linear-gradient(180deg, #1a4d1a 0%, #0d260d 100%);
            padding: 2rem;
            border-radius: 12px;
            margin-bottom: 2rem;
            position: relative;
          }
          .pitch::before {
            content: "";
            position: absolute;
            top: 50%;
            left: 0;
            right: 0;
            height: 2px;
            background: rgba(255, 255, 255, 0.2);
          }
          .players-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 1.5rem;
            position: relative;
          }
          .player-card {
            background: rgba(26, 26, 26, 0.9);
            border-radius: 12px;
            padding: 1.5rem;
            text-align: center;
            position: relative;
            border: 3px solid transparent;
            transition: transform 0.2s;
          }
          .player-card:hover {
            transform: translateY(-5px);
          }
          .player-card.captain {
            border-color: #ffd700;
            box-shadow: 0 0 30px rgba(255, 215, 0, 0.4);
          }
          .captain-badge {
            position: absolute;
            top: 10px;
            right: 10px;
            background: #ffd700;
            color: #000;
            width: 35px;
            height: 35px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 1.2rem;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
          }
          .player-image {
            margin-bottom: 1rem;
          }
          .player-image img {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            object-fit: cover;
            border: 3px solid #333;
          }
          .player-placeholder {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            background: #333;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
            font-weight: bold;
            color: #888;
            margin: 0 auto;
          }
          .player-info {
            color: white;
          }
          .player-name {
            font-weight: bold;
            font-size: 1.1rem;
            margin-bottom: 0.5rem;
          }
          .player-points {
            color: #4caf50;
            font-size: 1.5rem;
            font-weight: bold;
          }
          .captain-bonus {
            color: #ffd700;
            font-size: 0.9rem;
            margin-top: 0.25rem;
          }
          .breakdown {
            background: #1a1a1a;
            padding: 1.5rem;
            border-radius: 8px;
          }
          .breakdown h3 {
            margin-top: 0;
            margin-bottom: 1rem;
            color: white;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          td {
            padding: 0.75rem;
            border-bottom: 1px solid #333;
          }
          .points {
            text-align: right;
            font-weight: 500;
            color: #4caf50;
          }
          .captain-row td {
            color: #ffd700;
          }
          .total-row {
            border-top: 2px solid #4caf50;
          }
          .total-row td {
            padding-top: 1rem;
            font-size: 1.1rem;
          }
        `}</style>
      </div>
    </>
  );
}
