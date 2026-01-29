import { useState } from "react";
import OverallLeaderboard from "../components/FantasyLeaderboard/OverallLeaderboard";
import GameweekLeaderboard from "../components/FantasyLeaderboard/GameweekLeaderboard";

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<"overall" | "gameweek">("overall");

  return (
    <div className="leaderboard-page">
      <h1>Fantasy Leaderboard</h1>

      <div className="tabs">
        <button
          className={`tab ${activeTab === "overall" ? "active" : ""}`}
          onClick={() => setActiveTab("overall")}
        >
          Overall
        </button>
        <button
          className={`tab ${activeTab === "gameweek" ? "active" : ""}`}
          onClick={() => setActiveTab("gameweek")}
        >
          Gameweek Winners
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "overall" && <OverallLeaderboard />}
        {activeTab === "gameweek" && <GameweekLeaderboard />}
      </div>

      <style jsx>{`
        .leaderboard-page {
          padding: 2rem;
          max-width: 1000px;
          margin: 0 auto;
          min-height: 100vh;
          background: #0a0a0a;
          color: white;
        }
        h1 {
          text-align: center;
          margin-bottom: 2rem;
          color: white;
          font-weight: bold;
        }
        .tabs {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .tab {
          padding: 0.75rem 2rem;
          border: 2px solid #2a2a2a;
          background: #1a1a1a;
          color: gray;
          border-radius: 8px;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 500;
          transition: all 0.2s;
        }
        .tab:hover {
          border-color: #5dbc6f;
        }
        .tab.active {
          background: #1a1a1a;
          border-color: #5dbc6f;
          color: white;
        }
        .tab-content {
          background: #1a1a1a;
          border: 2px solid #2a2a2a;
          border-radius: 8px;
          padding: 1rem;
        }
      `}</style>
    </div>
  );
}
