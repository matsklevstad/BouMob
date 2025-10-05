function Header() {
  return (
    <header
      style={{
        display: "flex",
        backgroundColor: "#191919",
        borderRadius: "8px",
        padding: "0rem 1rem",
      }}
    >
      <img src="src/assets/header.png" alt="BouMob Logo" height={50} style={{ padding: "0.5rem 0rem", marginTop: "0.5rem" }} />
    </header>
  );
}

export default Header;
