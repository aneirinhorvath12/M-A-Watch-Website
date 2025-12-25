export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid rgba(0,0,0,.06)",
        marginTop: 80,
      }}
    >
      <div
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          padding: "24px 28px",
          fontSize: 13,
          color: "rgba(0,0,0,.6)",
        }}
      >
        © {new Date().getFullYear()} M&A Watch
      </div>
    </footer>
  );
}
