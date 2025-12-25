import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiFetch } from "../../lib/api";

type Media = {
  id: string;
  url: string;
  kind: "IMAGE" | "DOCUMENT";
  docType?: "XLSX" | "PDF" | "OTHER" | null;
  fileName?: string | null;
};

type Attachment = {
  label?: string | null;
  order: number;
  media: Media;
};

type Report = {
  id: string;
  slug: string;
  title: string;
  deck?: string | null;
  type: string;
  publishedAt?: string | null;
  content: any;
  attachments: Attachment[];
};

export default function ReportDetail() {
  const { slug } = useParams();
  const [report, setReport] = useState<Report | null>(null);
  const [err, setErr] = useState<string>("");

  useEffect(() => {
    if (!slug) return;
    apiFetch<{ report: Report }>(`/v1/reports/${slug}`)
      .then((d) => setReport(d.report))
      .catch((e) => setErr(e.message || "Failed to load"));
  }, [slug]);

  if (err) {
    return <div style={{ padding: 80, color: "crimson" }}>{err}</div>;
  }
  if (!report) {
    return <div style={{ padding: 80 }}>Loading…</div>;
  }

  return (
    <article style={{ padding: "80px 28px", maxWidth: 760, margin: "0 auto" }}>
      <div style={{ fontSize: 12, opacity: 0.7 }}>{report.type}</div>
      <h1 style={{ fontFamily: "var(--serif)", fontSize: 42, marginTop: 10 }}>
        {report.title}
      </h1>
      {report.deck && <p style={{ marginTop: 14, opacity: 0.8 }}>{report.deck}</p>}

      {/* Content placeholder for now */}
      <pre style={{ marginTop: 28, padding: 14, background: "rgba(0,0,0,.04)", borderRadius: 12, overflow: "auto" }}>
        {JSON.stringify(report.content, null, 2)}
      </pre>

      {report.attachments?.length > 0 && (
        <section style={{ marginTop: 28 }}>
          <h2 style={{ fontSize: 16, marginBottom: 10 }}>Attachments</h2>
          <ul>
            {report.attachments
              .slice()
              .sort((a, b) => a.order - b.order)
              .map((a, idx) => (
                <li key={`${a.media.id}-${idx}`}>
                  <a href={a.media.url} target="_blank" rel="noreferrer">
                    {a.label || a.media.fileName || a.media.docType || "Download"}
                  </a>
                </li>
              ))}
          </ul>
        </section>
      )}
    </article>
  );
}
