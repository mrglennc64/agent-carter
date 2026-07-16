"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface SystemMeta {
  id: string;
  name: string;
  category: string;
  description: string;
}

interface ProjectMeta {
  id: string;
  title: string;
  systemId: string;
  artifactTypeId: string;
  brief: string;
  createdAt: string;
}

const ARTIFACT_TYPES = [
  { id: "landing-page", label: "Landing page" },
  { id: "deck", label: "Pitch deck" },
  { id: "dashboard", label: "Dashboard" },
  { id: "poster", label: "Poster / hero" },
  { id: "social-card", label: "Social card" },
  { id: "email", label: "Email" },
];

/** Strip markdown fences / stray prose so only the HTML document remains. */
function extractHtml(raw: string): string {
  const start = raw.search(/<!doctype html|<html/i);
  if (start === -1) return raw;
  const endMatch = raw.match(/<\/html>/i);
  const end = endMatch ? endMatch.index! + endMatch[0].length : raw.length;
  return raw.slice(start, end);
}

export default function Studio() {
  const [systems, setSystems] = useState<SystemMeta[]>([]);
  const [systemId, setSystemId] = useState("");
  const [artifactTypeId, setArtifactTypeId] = useState("landing-page");
  const [brief, setBrief] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [html, setHtml] = useState("");
  const [view, setView] = useState<"preview" | "code">("preview");
  const [projects, setProjects] = useState<ProjectMeta[]>([]);
  const rawRef = useRef("");
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    fetch("/api/systems")
      .then((r) => r.json())
      .then((list: SystemMeta[]) => {
        setSystems(list);
        const own = list.find((s) => s.id === "heyroya");
        setSystemId(own?.id ?? list[0]?.id ?? "");
      })
      .catch(() => setError("Could not load design systems"));
    refreshProjects();
  }, []);

  function refreshProjects() {
    fetch("/api/projects")
      .then((r) => r.json())
      .then(setProjects)
      .catch(() => {});
  }

  const generate = useCallback(async () => {
    if (!systemId || !brief.trim() || busy) return;
    setBusy(true);
    setError("");
    setHtml("");
    setView("preview");
    rawRef.current = "";
    setStatus("Generating…");
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ systemId, artifactTypeId, brief }),
        signal: controller.signal,
      });
      if (!res.ok || !res.body) {
        throw new Error(await res.text().catch(() => `HTTP ${res.status}`));
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let lastPaint = 0;
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        rawRef.current += decoder.decode(value, { stream: true });
        setStatus(`Generating… ${(rawRef.current.length / 1024).toFixed(0)} KB`);
        const now = Date.now();
        if (now - lastPaint > 800) {
          lastPaint = now;
          setHtml(extractHtml(rawRef.current));
        }
      }
      const finalHtml = extractHtml(rawRef.current);
      const errMatch = rawRef.current.match(/<!-- GENERATION_ERROR: ([\s\S]*?) -->/);
      if (errMatch) throw new Error(errMatch[1]);
      if (!/<html/i.test(finalHtml)) throw new Error("Model did not return an HTML document");
      setHtml(finalHtml);
      setStatus(`Done — ${(finalHtml.length / 1024).toFixed(0)} KB`);
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setError((err as Error).message);
        setStatus("");
      } else {
        setStatus("Stopped");
      }
    } finally {
      setBusy(false);
      abortRef.current = null;
    }
  }, [systemId, artifactTypeId, brief, busy]);

  async function saveProject() {
    const title = window.prompt("Project name:", brief.slice(0, 50));
    if (!title) return;
    await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, systemId, artifactTypeId, brief, html }),
    });
    refreshProjects();
  }

  async function openProject(p: ProjectMeta) {
    const res = await fetch(`/api/projects/${p.id}`);
    if (!res.ok) return;
    setHtml(await res.text());
    setSystemId(p.systemId || systemId);
    setArtifactTypeId(p.artifactTypeId || artifactTypeId);
    setBrief(p.brief || brief);
    setStatus(`Loaded "${p.title}"`);
    setError("");
  }

  function download() {
    const blob = new Blob([html], { type: "text/html" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "artifact.html";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  const selected = systems.find((s) => s.id === systemId);

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          Design <span>Studio</span>
        </div>
        <div className="tagline">Brief in — on-brand artifact out</div>

        <label>Design system</label>
        <select value={systemId} onChange={(e) => setSystemId(e.target.value)}>
          {systems.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} — {s.category}
            </option>
          ))}
        </select>
        {selected?.description && <div className="sysdesc">{selected.description}</div>}

        <label>Artifact</label>
        <div className="chips">
          {ARTIFACT_TYPES.map((a) => (
            <button
              key={a.id}
              className={`chip ${a.id === artifactTypeId ? "active" : ""}`}
              onClick={() => setArtifactTypeId(a.id)}
            >
              {a.label}
            </button>
          ))}
        </div>

        <label>Brief</label>
        <textarea
          value={brief}
          onChange={(e) => setBrief(e.target.value)}
          placeholder="e.g. Landing page for HeyRoya's new bulk metadata-audit service for Swedish music publishers. Lead with a 98% match-rate stat…"
        />

        <div className="generate-row">
          {busy ? (
            <button onClick={() => abortRef.current?.abort()}>Stop</button>
          ) : (
            <button className="primary" onClick={generate} disabled={!systemId || !brief.trim()}>
              Generate
            </button>
          )}
        </div>
        {status && <div className="status">{status}</div>}
        {error && <div className="status error">{error}</div>}

        <div className="projects">
          <label>Saved projects</label>
          <ul>
            {projects.map((p) => (
              <li key={p.id}>
                <button onClick={() => openProject(p)} title={p.title}>
                  {p.title}
                </button>
              </li>
            ))}
            {projects.length === 0 && (
              <li>
                <span className="sysdesc">Nothing saved yet</span>
              </li>
            )}
          </ul>
        </div>
      </aside>

      <main className="main">
        <div className="toolbar">
          <button className={view === "preview" ? "primary" : ""} onClick={() => setView("preview")}>
            Preview
          </button>
          <button className={view === "code" ? "primary" : ""} onClick={() => setView("code")}>
            Code
          </button>
          <div className="spacer" />
          {selected && <span className="meta">{selected.name}</span>}
          <button onClick={saveProject} disabled={!html || busy}>
            Save
          </button>
          <button onClick={download} disabled={!html}>
            Download HTML
          </button>
        </div>
        <div className="viewport">
          {html ? (
            view === "preview" ? (
              <iframe sandbox="allow-scripts" srcDoc={html} title="artifact preview" />
            ) : (
              <pre>{html}</pre>
            )
          ) : (
            <div className="empty">
              <h2>No artifact yet</h2>
              <p>Pick a design system, choose an artifact type, write a brief, hit Generate.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
