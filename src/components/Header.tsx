import { useRouter } from "next/router";

function Header() {
  const router = useRouter();

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="logo" onClick={() => router.push("/")}>
          <img
            src="/header.png"
            alt="BouMob Logo"
            height={50}
            style={{
              padding: "0.5rem 0rem",
              marginTop: "0.5rem",
              cursor: "pointer",
            }}
          />
        </div>
      </div>
      <style jsx>{`
        .app-header {
          background: transparent;
        }
        .header-content {
          display: flex;
          justify-content: flex-start;
          align-items: center;
        }
        .logo {
          cursor: pointer;
        }
      `}</style>
    </header>
  );
}

export default Header;
