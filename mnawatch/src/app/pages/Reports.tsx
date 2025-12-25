import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../../lib/api";

type Report = {
  id: string;
  slug: string;
  title: string;
  deck?: string | null;
  type: "FINANCIAL" | "LEGAL" | "INTERVIEW";
  publishedAt?: string | null;
};

export default function Reports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [err, setErr] = useState<string>("");

  useEffect(() => {
    apiFetch<{ reports: Report[] }>("/v1/reports")
      .then((d) => setReports(d.reports))
      .catch((e) => setErr(e.message || "Failed to load"));
  }, []);

  return (
    <section style={{ padding: "80px 28px", maxWidth: 960, margin: "0 auto" }}>
      <h1 style={{ fontFamily: "var(--serif)", fontSize: 48 }}>Reports</h1>
      {err && <p style={{ color: "crimson" }}>{err}</p>}

      <div style={{ marginTop: 28, display: "grid", gap: 14 }}>
        {reports.map((r) => (
          <Link
            key={r.id}
            to={`/reports/${r.slug}`}
            style={{
              padding: 18,
              border: "1px solid rgba(0,0,0,.08)",
              borderRadius: 14,
              textDecoration: "none",
              display: "block",
            }}
          >
            <div style={{ fontSize: 12, opacity: 0.7 }}>{r.type}</div>
            <div style={{ fontSize: 18, marginTop: 6 }}>{r.title}</div>
            {r.deck && <div style={{ marginTop: 6, opacity: 0.75 }}>{r.deck}</div>}
          </Link>
        ))}
      </div>
    </section>
  );
}
