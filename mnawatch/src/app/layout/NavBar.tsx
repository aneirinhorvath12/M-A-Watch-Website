import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        background: "rgba(250,250,250,.9)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(0,0,0,.06)",
      }}
    >
      <div
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          padding: "16px 28px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Link
          to="/"
          style={{
            fontFamily: "var(--serif)",
            fontSize: 20,
            textDecoration: "none",
          }}
        >
          M&A Watch
        </Link>

        <nav style={{ display: "flex", gap: 16 }}>
          <Link to="/reports">Reports</Link>
          <Link to="/about">About</Link>
          <Link to="/apply">Join</Link>
        </nav>
      </div>
    </header>
  );
}
