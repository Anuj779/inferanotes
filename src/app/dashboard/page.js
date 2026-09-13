"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getNotes, saveNote, migrateNotes } from "@/lib/idb";
import { ArrowUpRight, Search, FileText, LoaderCircle, Sparkles } from "lucide-react";
import TutorialAnimation from "@/components/TutorialAnimation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { languages } from "@/lib/validation";
export default function DashboardPage() {
  const { user, loading, api } = useAuth();
  const router = useRouter();
  const [notes, setNotes] = useState([]);
  const [usage, setUsage] = useState(null);
  const [cursor, setCursor] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState("");
  const [url, setUrl] = useState("");
  const [language, setLanguage] = useState("en");
  const [detail, setDetail] = useState("detailed");
  const [transcript, setTranscript] = useState("");
  const [showTranscript, setShowTranscript] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  useEffect(() => {
    if (loading) return;
    let active = true;
    const load = async () => {
      try {
        const [history, allowance] = await Promise.all([
          api("/api/notes"),
          api("/api/usage"),
        ]);
        if (active) {
          setNotes(history.notes);
          setCursor(history.nextCursor);
          setUsage(allowance);
        }
      } catch (e) {
        if (active) setHistoryError(e.message);
      } finally {
        if (active) setHistoryLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
    // api reads the current Firebase user; rerun only when the identity changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading, router]);
  const generate = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const result = await api("/api/generate", {
        method: "POST",
        body: JSON.stringify({
          url,
          language,
          detail,
          ...(showTranscript && transcript.trim()
            ? { transcript: transcript.trim() }
            : {}),
        }),
      });
      router.push(`/notes/${result.noteId}`);
    } catch (e) {
      setError(e.message);
      if (e.code === "TRANSCRIPT_UNAVAILABLE" || e.code === "SOURCE_TOO_LONG" || e.code === "NO_CAPTIONS")
        setShowTranscript(true);
    } finally {
      setBusy(false);
      try {
        setUsage(await api("/api/usage"));
      } catch {
        /* Keep the original error. */
      }
    }
  };
  const more = async () => {
    setHistoryLoading(true);
    try {
      const result = await api(
        `/api/notes?cursor=${encodeURIComponent(cursor)}`,
      );
      setNotes((prev) => [...prev, ...result.notes]);
      setCursor(result.nextCursor);
    } catch (e) {
      setHistoryError(e.message);
    } finally {
      setHistoryLoading(false);
    }
  };
  return (
    <>
      <Navbar />
      <main id="main" className="shell workspace">
        <div className="workspace-heading">
          <div>
            <p className="eyebrow">YOUR STUDY SPACE</p>
            <h1>
              A little focus.
              <br />
              <span>A lot of possibility.</span>
            </h1>
          </div>
          <p>
            {user
              ? `Good to see you, ${user.displayName?.split(" ")[0] || "learner"}.`
              : "No sign-in needed. Start with a lecture below."}
            <br />
            What are we learning today?
          </p>
        </div>
        {(
          <>
            <div className="workspace-grid">
              <form className="generator" onSubmit={generate}>
                <div className="panel-title">
                  <Sparkles size={22} />
                  <h2>Start with a lecture.</h2>
                  <span className="badge">Free</span>
                </div>
                <label htmlFor="video-url">YouTube video link</label>
                <input
                  id="video-url"
                  type="url"
                  required
                  maxLength={2048}
                  placeholder="https://www.youtube.com/watch?v=…"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  disabled={busy}
                />
                <p style={{ color: "#ef4444", fontSize: "13px", marginTop: "4px", marginBottom: "12px", fontWeight: 500 }}>
                  Note: Videos over ~2 hours may be blocked by YouTube, requiring you to manually paste the transcript.
                </p>
                <div className="form-grid">
                  <div>
                    <label htmlFor="language">Your language</label>
                    <select
                      id="language"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      disabled={busy}
                    >
                      {Object.entries(languages).map(([key, label]) => (
                        <option value={key} key={key}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="detail">Note style</label>
                    <select
                      id="detail"
                      value={detail}
                      onChange={(e) => setDetail(e.target.value)}
                      disabled={busy}
                    >
                      <option value="detailed">Detailed study notes</option>
                      <option value="concise">Quick revision</option>
                    </select>
                  </div>
                </div>
                <button
                  className="text-link transcript-toggle"
                  type="button"
                  aria-expanded={showTranscript}
                  onClick={() => setShowTranscript((v) => !v)}
                >
                  {" "}
                  {showTranscript
                    ? "Hide transcript input"
                    : "Have a transcript? Paste it yourself"}{" "}
                  <ArrowUpRight size={14} />
                </button>
                {showTranscript && (
                  <div style={{ background: "var(--surface-hover)", padding: "16px", borderRadius: "12px", marginTop: "12px", border: "1px solid var(--border)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", flexWrap: "wrap", gap: "8px" }}>
                      <label htmlFor="transcript" style={{ margin: 0, fontSize: "14px", fontWeight: 600 }}>
                        Manual Transcript Fallback
                      </label>
                      {url && (
                        <a 
                          href={url} 
                          target="_blank" 
                          rel="noreferrer"
                          style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "13px", color: "#3b82f6", fontWeight: 600 }}
                        >
                          Step 1: Open video to copy transcript <ArrowUpRight size={14} />
                        </a>
                      )}
                    </div>
                    <div style={{ fontSize: "13px", color: "var(--foreground-muted)", marginBottom: "12px", lineHeight: "1.5", background: "var(--background)", padding: "10px", borderRadius: "8px", border: "1px dashed var(--border)" }}>
                      <p style={{ fontWeight: 600, color: "var(--foreground)", marginBottom: "6px", marginTop: 0 }}>How to get the transcript:</p>
                      <ol style={{ margin: 0, paddingLeft: "20px" }}>
                        <li>Click the blue link above to open the video.</li>
                        <li>Below the video description, click <strong>"...more"</strong>, then scroll down and click <strong>"Show transcript"</strong>.</li>
                        <li>Highlight and copy all the text from the transcript window on the right.</li>
                        <li>Paste it into the box below.</li>
                      </ol>
                      <TutorialAnimation />
                    </div>
                    <textarea
                      id="transcript"
                      minLength={100}
                      maxLength={1000000}
                      rows={6}
                      value={transcript}
                      onChange={(e) => setTranscript(e.target.value)}
                      disabled={busy}
                      placeholder="Step 2: Paste the text you copied from YouTube here..."
                      style={{ width: "100%", marginTop: "4px", borderRadius: "8px", border: "1px solid var(--border)", padding: "12px", background: "var(--background)", color: "var(--foreground)" }}
                    />
                  </div>
                )}
                {error && (
                  <p className="error" role="alert">
                    {error}
                  </p>
                )}
                <button className="button full" disabled={busy} type="submit">
                  {busy ? (
                    <>
                      <LoaderCircle className="spin" size={18} />
                      Reading your lecture and creating notes…
                    </>
                  ) : (
                    <>
                      Create my notes <ArrowUpRight size={18} />
                    </>
                  )}
                </button>
                <p className="form-hint" role="status">
                  {busy
                    ? "This can take up to a few minutes. Keep this page open."
                    : "Your notes include a summary, key concepts and practice questions."}
                </p>
              </form>
              <aside className="workspace-aside">
                <span className="big-symbol" aria-hidden="true">
                  ↗
                </span>
                <h3>
                  One less thing
                  <br />
                  to write down.
                </h3>
                <p>
                  Use your time to understand the topic. Let us organize the
                  notes. Your guest notebook stays with this browser. Clearing
                  site data or switching devices loses access; download notes
                  you want to keep.
                </p>
                <div className="allowance">
                  <strong>
                    {usage
                      ? `${Math.max(0, usage.limit - usage.used)} of ${usage.limit}`
                      : "Daily allowance"}
                  </strong>
                  <span>free attempts available today</span>
                </div>
                <small>
                  All features are free. Attempts reset at midnight UTC. Failed
                  attempts count toward fair use; reopening saved notes does
                  not.
                </small>
              </aside>
            </div>
            <section className="library">
              <div className="library-heading">
                <h2>Your notebook</h2>
                <div className="search">
                  <Search size={17} />
                  <input
                    aria-label="Search loaded notes"
                    placeholder="Search loaded notes"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
              {historyError && (
                <p role="alert" className="error">
                  {historyError}
                </p>
              )}
              {historyLoading && !notes.length ? (
                <div className="skeleton">Loading your notebook…</div>
              ) : !notes.length ? (
                <div className="empty">
                  <FileText size={35} />
                  <h3>Your first idea belongs here.</h3>
                  <p>Add a lecture above to start your notebook.</p>
                </div>
              ) : (
                <div className="note-grid">
                  {notes
                    .filter((n) =>
                      n.videoTitle
                        ?.toLowerCase()
                        .includes(search.toLowerCase()),
                    )
                    .map((note) => (
                      <Link
                        href={`/notes/${note.id}`}
                        className="note-card"
                        key={note.id}
                      >
                        <FileText size={23} />
                        <span>{languages[note.language] || note.language}</span>
                        <h3>{note.videoTitle}</h3>
                        <div>
                          <small>
                            {note.createdAt
                              ? new Date(note.createdAt).toLocaleDateString()
                              : "Saved note"}
                          </small>
                          <ArrowUpRight size={20} />
                        </div>
                      </Link>
                    ))}
                </div>
              )}
              {notes.length > 0 &&
                !notes.some((n) =>
                  n.videoTitle?.toLowerCase().includes(search.toLowerCase()),
                ) && <p className="empty">No matching notes on this page.</p>}
              {cursor && (
                <button
                  onClick={more}
                  disabled={historyLoading}
                  className="button secondary"
                >
                  {historyLoading ? "Loading…" : "Load more"}
                </button>
              )}
            </section>
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
