const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export function apiUrl(path: string) {
  return `${API_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export async function apiFetch<T>(path: string, opts: RequestInit = {}, token?: string): Promise<T> {
  const headers = new Headers(opts.headers);

  if (!headers.has("Content-Type") && opts.body && !(opts.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(apiUrl(path), { ...opts, headers });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const msg = data?.error ? (typeof data.error === "string" ? data.error : JSON.stringify(data.error)) : `${res.status} ${res.statusText}`;
    throw new Error(msg);
  }

  return data as T;
}
