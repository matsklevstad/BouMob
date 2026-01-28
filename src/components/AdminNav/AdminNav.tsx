import { useRouter } from "next/router";

interface AdminNavProps {
  currentPage: "players" | "gameweeks" | "match-stats";
}

export default function AdminNav({ currentPage }: AdminNavProps) {
  const router = useRouter();

  return (
    <div className="admin-nav">
      <button className="back-button" onClick={() => router.push("/fantasy")}>
        ← Back to Fantasy
      </button>

      <div className="nav-tabs">
        <div
          className={`nav-tab ${currentPage === "players" ? "active" : ""}`}
          onClick={() => router.push("/admin/players")}
        >
          Players
        </div>
        <div
          className={`nav-tab ${currentPage === "gameweeks" ? "active" : ""}`}
          onClick={() => router.push("/admin/gameweeks")}
        >
          Gameweeks
        </div>
        <div
          className={`nav-tab ${currentPage === "match-stats" ? "active" : ""}`}
          onClick={() => router.push("/admin/match-stats")}
        >
          Match Stats
        </div>
      </div>

      <style jsx>{`
        .admin-nav {
          background: #1a1a1a;
          border: 2px solid #2a2a2a;
          border-radius: 12px;
          padding: 1rem;
          margin-bottom: 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .back-button {
          padding: 0.5rem 1rem;
          background: #2a2a2a;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.95rem;
          transition: all 0.2s;
        }

        .back-button:hover {
          background: #3a3a3a;
        }

        .nav-tabs {
          display: flex;
          gap: 1rem;
          flex: 1;
          justify-content: center;
        }

        .nav-tab {
          padding: 0.5rem 1.5rem;
          color: gray;
          cursor: pointer;
          font-weight: 500;
          border-bottom: 3px solid transparent;
          transition: all 0.2s;
        }

        .nav-tab:hover {
          color: white;
        }

        .nav-tab.active {
          color: white;
          border-bottom-color: #5dbc6f;
        }

        @media (max-width: 768px) {
          .admin-nav {
            flex-direction: column;
            align-items: stretch;
          }

          .nav-tabs {
            justify-content: space-around;
          }

          .nav-tab {
            padding: 0.5rem 1rem;
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
}
