"use client";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, Check, Download, Printer, ArrowUpRight } from "lucide-react";
function download(text, name) {
  const url = URL.createObjectURL(
    new Blob([text], { type: "text/markdown;charset=utf-8" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = `${name.replace(/[^\p{L}\p{N} -]/gu, "").slice(0, 80) || "notes"}.md`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export default function NotesDisplay({
  notes,
  videoTitle,
  videoUrl,
  preview = false,
}) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(notes);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setError("Copy was blocked. Use Download Markdown instead.");
    }
  };
  const safeVideo = /^https:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]{11}$/.test(
    videoUrl || "",
  )
    ? videoUrl
    : null;
  // Markdown is escaped by React; raw HTML is deliberately disabled.
  const text = safeVideo
    ? notes.replace(
        /\[(\d{1,3}):(\d{2})\](?!\()/g,
        (_, m, s) =>
          `[${m}:${s}](${safeVideo}&t=${Number(m) * 60 + Number(s)}s)`,
      )
    : notes;
  return (
    <div className="note-display">
      {!preview && (
        <div className="note-toolbar">
          <div>
            {safeVideo && (
              <a
                href={safeVideo}
                target="_blank"
                rel="noreferrer"
                className="text-link"
              >
                Original lecture <ArrowUpRight size={15} />
              </a>
            )}
          </div>
          <div className="toolbar-actions">
            <button className="button secondary small" onClick={copy}>
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? "Copied" : "Copy"}
            </button>
            <button
              className="button secondary small"
              onClick={() => download(notes, videoTitle || "notes")}
            >
              <Download size={16} />
              Markdown
            </button>
            <button className="button small" onClick={() => window.print()}>
              <Printer size={16} />
              Save PDF
            </button>
          </div>
        </div>
      )}
      {error && (
        <p role="alert" className="error">
          {error}
        </p>
      )}
      <article className="prose">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          skipHtml
          components={{
            a: ({ children, href }) => (
              <a href={href} target="_blank" rel="noopener noreferrer">
                {children}
              </a>
            ),
          }}
        >
          {text}
        </ReactMarkdown>
      </article>
    </div>
  );
}
