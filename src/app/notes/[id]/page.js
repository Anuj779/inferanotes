"use client";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Trash2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import NotesDisplay from "@/components/NotesDisplay";
export default function NotePage({ params }) {
  const { id } = use(params);
  const { user, loading, api } = useAuth();
  const router = useRouter();
  const [note, setNote] = useState(null);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
      return;
    }
    if (!user) return;
    let active = true;
    api(`/api/notes/${encodeURIComponent(id)}`)
      .then((data) => {
        if (active) setNote(data.note);
      })
      .catch((e) => {
        if (active) setError(e.message);
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user, loading, router]);
  const remove = async () => {
    if (!window.confirm("Delete this note? This cannot be undone.")) return;
    setDeleting(true);
    try {
      await api(`/api/notes/${encodeURIComponent(id)}`, { method: "DELETE" });
      router.replace("/dashboard");
    } catch (e) {
      setError(e.message);
      setDeleting(false);
    }
  };
  return (
    <>
      <Navbar />
      <main id="main" className="shell reader">
        <div className="reader-nav">
          <Link href="/dashboard" className="text-link">
            <ArrowLeft size={16} />
            Your notebook
          </Link>
          {note && (
            <button
              className="icon-button"
              aria-label="Delete note"
              onClick={remove}
              disabled={deleting}
            >
              <Trash2 size={17} />
            </button>
          )}
        </div>
        {error && (
          <p role="alert" className="error">
            {error}
          </p>
        )}
        {note ? (
          <>
            <p className="reader-label">{note.videoTitle}</p>
            <NotesDisplay
              notes={note.notes}
              videoTitle={note.videoTitle}
              videoUrl={note.videoUrl}
            />
            <p className="form-hint print-hide">
              AI notes can contain errors. Check important details against the
              lecture. Use Save PDF and choose “Save as PDF” in the print
              dialog.
            </p>
          </>
        ) : (
          !error && (
            <div className="skeleton" role="status">
              Opening your notes…
            </div>
          )
        )}
      </main>
    </>
  );
}
