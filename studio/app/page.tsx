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

interface Turn {
  role: "user" | "assistant";
  content: string;
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

/** Keep every user turn but only the latest artifact HTML, to keep requests small. */
function pruneTurns(turns: Turn[]): Turn[] {
  const lastAssistant = turns.map((t) => t.role).lastIndexOf("assistant");
  return turns.map((t, i) =>
    t.role === "assistant" && i !== lastAssistant
      ? { role: "assistant" as const, content: "[previous artifact version omitted]" }
      : t
  );
}

export default function Studio() {
  const [systems, setSystems] = useState<SystemMeta[]>([]);
  const [systemId, setSystemId] = useState("");
  const [artifactTypeId, setArtifactTypeId] = useState("landing-page");
  const [brief, setBrief] = useState("");
  const [instruction, setInstruction] = useState("");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [html, setHtml] = useState("");
  const [view, setView] = useState<"preview" | "code">("preview");
  const [projects, setProjects] = useState<ProjectMeta[]>([]);
  const rawRef = useRef("");
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const onError = (e: ErrorEvent) => setError(`Page error: ${e.message}`);
    window.addEventListener("error", onError);
    return () => window.removeEventListener("error", onError);
  }, []);

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

  /** Send a conversation to the API, stream the artifact, and record the exchange. */
  const run = useCallback(
    async (nextTurns: Turn[]) => {
      setBusy(true);
      setError("");
      setView("preview");
      rawRef.current = "";
      setStatus("Generating…");
      const controller = new AbortController();
      abortRef.current = controller;
      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ systemId, artifactTypeId, messages: pruneTurns(nextTurns) }),
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
        setTurns([...nextTurns, { role: "assistant", content: finalHtml }]);
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
    },
    [systemId, artifactTypeId]
  );

  const generate = useCallback(() => {
    if (busy) return;
    if (!systemId) {
      setError("Pick a design system first.");
      return;
    }
    if (!brief.trim()) {
      setError("Write a brief first — describe what you want in the box above.");
      return;
    }
    // A fresh brief starts a fresh conversation.
    void run([{ role: "user", content: `Brief:\n${brief.trim()}` }]);
  }, [busy, systemId, brief, run]);

  const refine = useCallback(() => {
    if (busy || !instruction.trim() || turns.length === 0) return;
    const next: Turn[] = [
      ...turns,
      {
        role: "user",
        content: `Revise the artifact: ${instruction.trim()}\n\nReturn the complete updated HTML document. Keep everything else unchanged unless the revision requires it.`,
      },
    ];
    setInstruction("");
    void run(next);
  }, [busy, instruction, turns, run]);

  function resetConversation() {
    setTurns([]);
    setHtml("");
    setStatus("");
    setError("");
    setInstruction("");
  }

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
    const loaded = await res.text();
    setHtml(loaded);
    setSystemId(p.systemId || systemId);
    setArtifactTypeId(p.artifactTypeId || artifactTypeId);
    setBrief(p.brief || brief);
    // Seed the conversation so refinement works on loaded projects too.
    setTurns([
      { role: "user", content: `Brief:\n${p.brief || "(saved project)"}` },
      { role: "assistant", content: loaded },
    ]);
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
  const userTurns = turns.filter((t) => t.role === "user");
  const hasArtifact = turns.length > 0 && !!html;

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
            <button className="primary" onClick={generate}>
              {turns.length > 0 ? "Regenerate from brief" : "Generate"}
            </button>
          )}
        </div>

        {hasArtifact && !busy && (
          <div className="refine">
            <label>Refine</label>
            {userTurns.length > 1 && (
              <ul className="chatlog">
                {userTurns.slice(1).map((t, i) => (
                  <li key={i}>{t.content.replace(/^Revise the artifact: /, "").split("\n")[0]}</li>
                ))}
              </ul>
            )}
            <textarea
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  refine();
                }
              }}
              placeholder="e.g. make the hero darker, add a pricing section, shorter headline… (Enter to send)"
              style={{ minHeight: 70 }}
            />
            <div className="refine-actions">
              <button className="primary" onClick={refine} disabled={!instruction.trim()}>
                Apply revision
              </button>
              <button onClick={resetConversation}>New</button>
            </div>
          </div>
        )}

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
          ) : busy ? (
            <div className="empty">
              <div className="spinner" />
              <h2>Designing…</h2>
              <p>{status || "Claude is working on your artifact. This takes 20–60 seconds."}</p>
            </div>
          ) : (
            <div className="empty">
              <h2>No artifact yet</h2>
              <p>Pick a design system, choose an artifact type, write a brief, hit Generate.</p>
              {error && <p style={{ color: "var(--danger)" }}>{error}</p>}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
