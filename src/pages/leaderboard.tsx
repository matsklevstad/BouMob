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
        }
        h1 {
          text-align: center;
          margin-bottom: 2rem;
        }
        .tabs {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .tab {
          padding: 0.75rem 2rem;
          border: none;
          background: white;
          border-radius: 8px 8px 0 0;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 500;
          transition: all 0.2s;
        }
        .tab:hover {
          background: #f5f5f5;
        }
        .tab.active {
          background: #4caf50;
          color: white;
        }
        .tab-content {
          background: white;
          border-radius: 8px;
          padding: 1rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
}
