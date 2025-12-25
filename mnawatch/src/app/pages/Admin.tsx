import { useMemo, useState } from "react";
import { apiFetch } from "../../lib/api";
import { getToken, setToken as storeToken, clearToken } from "../../lib/auth";

type Report = { id: string; title: string; slug: string; status: string };

export default function Admin() {
  const [token, setToken] = useState<string>(getToken());
  const [email, setEmail] = useState("admin@mnawatch.local");
  const [password, setPassword] = useState("Password123!");
  const [msg, setMsg] = useState("");
  const [reports, setReports] = useState<Report[]>([]);

  const auth = useMemo(() => token, [token]);

  async function login() {
    setMsg("");
    const d = await apiFetch<{ accessToken: string }>("/v1/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    storeToken(d.accessToken);
    setToken(d.accessToken);
    setMsg("Logged in.");
  }

  async function logout() {
    clearToken();
    setToken("");
    setReports([]);
    setMsg("Logged out.");
  }

  async function loadReports() {
    setMsg("");
    const d = await apiFetch<{ reports: Report[] }>("/v1/admin/reports", {}, auth);
    setReports(d.reports);
    setMsg(`Loaded ${d.reports.length} reports.`);
  }

  async function createDraft() {
    setMsg("");
    const title = prompt("Title?", "Test Report") || "";
    const slug = prompt("Slug?", "test-report") || "";
    const type = (prompt("Type? FINANCIAL / LEGAL / INTERVIEW", "FINANCIAL") || "FINANCIAL") as any;

    const d = await apiFetch<{ report: any }>("/v1/admin/reports", {
      method: "POST",
      body: JSON.stringify({
        title,
        slug,
        type,
        deck: "Draft deck",
        content: { blocks: [] },
      }),
    }, auth);

    setMsg(`Created draft: ${d.report.slug}`);
    await loadReports();
  }

  async function publish(id: string) {
    setMsg("");
    await apiFetch(`/v1/admin/reports/${id}/publish`, { method: "POST" }, auth);
    setMsg("Published.");
    await loadReports();
  }

  async function uploadFile(file: File) {
    setMsg("");
    const fd = new FormData();
    fd.append("file", file);

    const d = await apiFetch<{ media: { id: string; url: string; kind: string; docType?: string } }>(
      "/v1/media/upload",
      { method: "POST", body: fd },
      auth
    );

    setMsg(`Uploaded: ${d.media.kind} → ${d.media.url}`);
  }

  return (
    <section style={{ padding: "80px 28px", maxWidth: 960, margin: "0 auto" }}>
      <h1 style={{ fontFamily: "var(--serif)", fontSize: 48 }}>Admin</h1>

      <div style={{ marginTop: 16, display: "grid", gap: 10, maxWidth: 520 }}>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" type="password" />
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={login} disabled={!!token}>Login</button>
          <button onClick={logout} disabled={!token}>Logout</button>
          <button onClick={loadReports} disabled={!token}>Load reports</button>
          <button onClick={createDraft} disabled={!token}>Create draft</button>
        </div>

        <div style={{ marginTop: 10 }}>
          <label style={{ display: "block", marginBottom: 6 }}>Upload image / Excel</label>
          <input
            type="file"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) uploadFile(f);
            }}
          />
        </div>

        {msg && <div style={{ opacity: 0.8 }}>{msg}</div>}
      </div>

      <div style={{ marginTop: 28 }}>
        <h2 style={{ fontSize: 16 }}>Reports</h2>
        <div style={{ display: "grid", gap: 10, marginTop: 10 }}>
          {reports.map((r) => (
            <div
              key={r.id}
              style={{ padding: 12, border: "1px solid rgba(0,0,0,.08)", borderRadius: 12, display: "flex", justifyContent: "space-between", gap: 12 }}
            >
              <div>
                <div style={{ fontWeight: 600 }}>{r.title}</div>
                <div style={{ fontSize: 12, opacity: 0.7 }}>{r.slug} · {r.status}</div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => publish(r.id)} disabled={!token || r.status === "PUBLISHED"}>
                  Publish
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
