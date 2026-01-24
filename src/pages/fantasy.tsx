import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../contexts/AuthContext";
import { Player } from "../types/Player";
import { Gameweek } from "../types/Gameweek";

export default function FantasyPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const router = useRouter();
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameweek, setGameweek] = useState<Gameweek | null>(null);
  const [selectedPlayers, setSelectedPlayers] = useState<number[]>([]);
  const [captain, setCaptain] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (gameweek) {
      const interval = setInterval(() => {
        const deadline = new Date(gameweek.deadline_at);
        const now = new Date();
        const diff = deadline.getTime() - now.getTime();

        if (diff <= 0) {
          setTimeLeft("Deadline passed");
          clearInterval(interval);
        } else {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor(
            (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
          );
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);

          if (days > 0) {
            setTimeLeft(`${days}d ${hours}h ${minutes}m`);
          } else if (hours > 0) {
            setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
          } else {
            setTimeLeft(`${minutes}m ${seconds}s`);
          }
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [gameweek]);

  const fetchData = async () => {
    try {
      const [playersRes, gameweekRes, picksRes] = await Promise.all([
        fetch("/api/players"),
        fetch("/api/fantasy/current-gameweek"),
        profile ? fetch("/api/fantasy/save-picks") : Promise.resolve(null),
      ]);

      const playersData = await playersRes.json();
      const gameweekData = await gameweekRes.json();

      setPlayers(playersData);
      setGameweek(gameweekData);

      // Load existing picks if available
      if (picksRes && gameweekData) {
        const picksData = await picksRes.json();
        const currentPick = picksData.find(
          (p: any) => p.gameweek_id === gameweekData.id,
        );
        if (currentPick) {
          setSelectedPlayers([
            currentPick.player_1_id,
            currentPick.player_2_id,
            currentPick.player_3_id,
            currentPick.player_4_id,
          ]);
          setCaptain(currentPick.captain_player_id);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const togglePlayer = (playerId: number) => {
    if (isDeadlinePassed()) return;

    if (selectedPlayers.includes(playerId)) {
      setSelectedPlayers(selectedPlayers.filter((id) => id !== playerId));
      if (captain === playerId) setCaptain(null);
    } else if (selectedPlayers.length < 4) {
      setSelectedPlayers([...selectedPlayers, playerId]);
    }
  };

  const toggleCaptain = (playerId: number) => {
    if (isDeadlinePassed()) return;
    if (selectedPlayers.includes(playerId)) {
      setCaptain(captain === playerId ? null : playerId);
    }
  };

  const getTotalCost = () => {
    return selectedPlayers.reduce((sum, id) => {
      const player = players.find((p) => p.id === id);
      return sum + (player?.price || 0);
    }, 0);
  };

  const isDeadlinePassed = () => {
    if (!gameweek) return true;
    return new Date() > new Date(gameweek.deadline_at);
  };

  const canSave = () => {
    return (
      selectedPlayers.length === 4 &&
      captain !== null &&
      getTotalCost() <= 20 &&
      !isDeadlinePassed()
    );
  };

  const handleSave = async () => {
    if (!canSave() || !gameweek || !profile) return;

    setSaving(true);
    try {
      const response = await fetch("/api/fantasy/save-picks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameweek_id: gameweek.id,
          player_1_id: selectedPlayers[0],
          player_2_id: selectedPlayers[1],
          player_3_id: selectedPlayers[2],
          player_4_id: selectedPlayers[3],
          captain_player_id: captain,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }

      alert("Team saved successfully!");
    } catch (error: any) {
      alert("Error saving team: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!gameweek) {
    return (
      <div className="no-gameweek">
        <h2>No active gameweek</h2>
        <p>Please wait for the admin to create the next gameweek.</p>
      </div>
    );
  }

  const deadlinePassed = isDeadlinePassed();
  const totalCost = getTotalCost();
  const remainingBudget = 20 - totalCost;

  return (
    <div className="fantasy-page">
      <div className="header">
        <div>
          <h1>{gameweek.round_name}</h1>
          <p className="match-date">
            {new Date(gameweek.match_date).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="deadline">
          <span className="deadline-label">Deadline:</span>
          <span className={`deadline-time ${deadlinePassed ? "passed" : ""}`}>
            {timeLeft}
          </span>
        </div>
      </div>

      <div className="budget-bar">
        <div className="budget-item">
          <span className="label">Budget:</span>
          <span className="value">20M</span>
        </div>
        <div className="budget-item">
          <span className="label">Spent:</span>
          <span className="value">{totalCost.toFixed(1)}M</span>
        </div>
        <div className="budget-item">
          <span className="label">Remaining:</span>
          <span className={`value ${remainingBudget < 0 ? "over-budget" : ""}`}>
            {remainingBudget.toFixed(1)}M
          </span>
        </div>
        <div className="budget-item">
          <span className="label">Selected:</span>
          <span className="value">{selectedPlayers.length}/4</span>
        </div>
      </div>

      <div className="players-grid">
        {players.map((player) => {
          const isSelected = selectedPlayers.includes(player.id);
          const isCaptain = captain === player.id;

          return (
            <div
              key={player.id}
              className={`player-card ${isSelected ? "selected" : ""} ${
                deadlinePassed ? "locked" : ""
              }`}
              onClick={() => !deadlinePassed && togglePlayer(player.id)}
            >
              {player.photo_url && (
                <div className="player-photo">
                  <img
                    src={player.photo_url}
                    alt={`${player.first_name} ${player.last_name}`}
                  />
                </div>
              )}
              <div className="player-info">
                <h3>
                  {player.first_name} {player.last_name}
                </h3>
                <p className="position">{player.position || "Player"}</p>
                <p className="price">{player.price}M</p>
              </div>
              {isSelected && (
                <button
                  className={`captain-btn ${isCaptain ? "is-captain" : ""}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleCaptain(player.id);
                  }}
                >
                  {isCaptain ? "⭐ Captain" : "Make Captain"}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {!deadlinePassed && (
        <div className="actions">
          <button
            onClick={handleSave}
            disabled={!canSave() || saving}
            className="save-button"
          >
            {saving ? "Saving..." : "Save Team"}
          </button>
          {!canSave() && (
            <p className="validation-message">
              {selectedPlayers.length !== 4 && "Select exactly 4 players. "}
              {captain === null &&
                selectedPlayers.length === 4 &&
                "Choose a captain. "}
              {remainingBudget < 0 && "Budget exceeded! "}
            </p>
          )}
        </div>
      )}

      {deadlinePassed && (
        <div className="locked-message">
          <p>The deadline has passed. Your team is locked in.</p>
        </div>
      )}

      <style jsx>{`
        .fantasy-page {
          padding: 2rem;
          max-width: 1400px;
          margin: 0 auto;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }
        h3 {
          color: black;
        }
        h1 {
          margin: 0;
          font-size: 2rem;
        }
        .match-date {
          color: #666;
          margin: 0.5rem 0 0 0;
        }
        .deadline {
          text-align: right;
        }
        .deadline-label {
          display: block;
          color: #666;
          font-size: 0.9rem;
          margin-bottom: 0.25rem;
        }
        .deadline-time {
          display: block;
          font-size: 1.5rem;
          font-weight: bold;
          color: #4caf50;
        }
        .deadline-time.passed {
          color: #f44336;
        }
        .budget-bar {
          display: flex;
          justify-content: space-around;
          background: white;
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          margin-bottom: 2rem;
        }
        .budget-item {
          text-align: center;
        }
        .budget-item .label {
          display: block;
          color: #666;
          font-size: 0.9rem;
          margin-bottom: 0.25rem;
        }
        .budget-item .value {
          display: block;
          font-size: 1.5rem;
          font-weight: bold;
          color: #333;
        }
        .budget-item .value.over-budget {
          color: #f44336;
        }
        .players-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        .player-card {
          background: white;
          border-radius: 8px;
          padding: 1rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          cursor: pointer;
          transition:
            transform 0.2s,
            box-shadow 0.2s;
          border: 3px solid transparent;
        }
        .player-card:hover:not(.locked) {
          transform: translateY(-4px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        .player-card.selected {
          border-color: #4caf50;
        }
        .player-card.locked {
          cursor: not-allowed;
          opacity: 0.7;
        }
        .player-photo img {
          width: 100%;
          height: 200px;
          object-fit: cover;
          border-radius: 4px;
          margin-bottom: 1rem;
        }
        .player-info h3 {
          margin: 0 0 0.5rem 0;
          font-size: 1.1rem;
        }
        .position {
          color: #666;
          font-size: 0.9rem;
          margin: 0.25rem 0;
        }
        .price {
          font-weight: bold;
          color: #4caf50;
          margin: 0.25rem 0;
          font-size: 1.1rem;
        }
        .captain-btn {
          width: 100%;
          padding: 0.5rem;
          margin-top: 0.5rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
        }
        .captain-btn:not(.is-captain) {
          background: #e0e0e0;
          color: #666;
        }
        .captain-btn.is-captain {
          background: #ffc107;
          color: #000;
        }
        .actions {
          text-align: center;
        }
        .save-button {
          padding: 1rem 3rem;
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
        .validation-message {
          color: #f44336;
          margin-top: 1rem;
        }
        .locked-message {
          text-align: center;
          padding: 1.5rem;
          background: #fff3e0;
          border-radius: 8px;
          color: #f57c00;
          font-weight: 500;
        }
        .no-gameweek {
          text-align: center;
          padding: 4rem 2rem;
        }
        .loading {
          text-align: center;
          padding: 2rem;
        }
      `}</style>
    </div>
  );
}
