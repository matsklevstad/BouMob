import { useRouter } from "next/router";
import { useAuth } from "../contexts/AuthContext";
import Head from "next/head";

export default function FantasyHome() {
  const router = useRouter();
  const { user, profile } = useAuth();

  return (
    <>
      <Head>
        <title>Fantasy - BouMob</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div className="fantasy-home">
        <div className="header-section">
          <div className="logo" onClick={() => router.push("/")}>
            <img src="/header.png" alt="BouMob Logo" height={50} />
          </div>
        </div>

        <div className="content">
          <h1>Velkommen til BouMob Fantasy!</h1>
          <p className="subtitle">
            Velg ditt drømmelag og konkurrer med vennene dine!
          </p>

          <div className="menu-grid">
            <div
              className="menu-card"
              onClick={() => router.push("/pick-team")}
            >
              <div className="icon">⚽</div>
              <h2>Mitt lag</h2>
              <p>Velg spillere og administrer laget ditt</p>
            </div>

            <div
              className="menu-card"
              onClick={() => router.push("/leaderboard")}
            >
              <div className="icon">🏆</div>
              <h2>Leaderboard</h2>
              <p>Se hvordan du rangerer mot andre managere</p>
            </div>

            {profile?.is_admin && (
              <div
                className="menu-card"
                onClick={() => router.push("/admin/players")}
              >
                <div className="icon">⚙️</div>
                <h2>Adminpanel</h2>
                <p>Administrer spillere, kampuker og kampstatistikk</p>
              </div>
            )}

            <div className="menu-card" onClick={() => router.push("/profile")}>
              <div className="icon">👤</div>
              <h2>Profil</h2>
              <p>Oppdater ditt lagnavn og innstillinger</p>
            </div>
          </div>

          <button className="back-button" onClick={() => router.push("/")}>
            ← Tilbake til hovedsiden
          </button>
        </div>
      </div>

      <style jsx>{`
        .fantasy-home {
          min-height: 100vh;
          background: #0a0a0a;
          color: white;
        }

        .header-section {
          background: #1a1a1a;
          padding: 1rem 2rem;
          display: flex;
          justify-content: center;
        }

        .logo {
          cursor: pointer;
        }

        .content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 3rem 2rem;
          text-align: center;
        }

        h1 {
          font-size: 3rem;
          margin-bottom: 1rem;
          color: white;
          font-weight: bold;
        }

        .subtitle {
          font-size: 1.25rem;
          color: gray;
          margin-bottom: 3rem;
        }

        .menu-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .menu-card {
          background: #1a1a1a;
          border: 2px solid #2a2a2a;
          border-radius: 12px;
          padding: 2rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .menu-card:hover {
          border-color: #5dbc6f;
          transform: translateY(-5px);
        }

        .icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .menu-card h2 {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
          color: white;
        }

        .menu-card p {
          color: gray;
          font-size: 0.95rem;
        }

        .back-button {
          background: #2a2a2a;
          color: white;
          border: none;
          padding: 0.75rem 2rem;
          font-size: 1rem;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .back-button:hover {
          background: #3a3a3a;
        }

        @media (max-width: 768px) {
          h1 {
            font-size: 2rem;
          }
          .menu-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
