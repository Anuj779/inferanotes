"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowUpRight, BookOpen } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
export default function LoginPage() {
  const { user, loading, configured, loginWithGoogle } = useAuth();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    if (user) router.replace("/dashboard");
  }, [user, router]);
  const login = async () => {
    setError("");
    setBusy(true);
    try {
      await loginWithGoogle();
    } catch (e) {
      setError(
        e.code === "auth/popup-closed-by-user"
          ? "Sign-in was closed. You can try again."
          : "Could not sign in. Check your connection and allow the sign-in popup.",
      );
    } finally {
      setBusy(false);
    }
  };
  return (
    <>
      <Navbar />
      <main id="main" className="login-layout shell">
        <div>
          <p className="eyebrow">A FRESH PAGE</p>
          <h1>
            Your next
            <br />
            <span>aha moment.</span>
          </h1>
          <p className="hero-description">
            Save your lectures, find the key ideas and come back ready to learn.
          </p>
        </div>
        <section className="login-panel">
          <BookOpen size={32} />
          <h2>Welcome to InferaNotes.</h2>
          <p>Your private study space starts here.</p>
          {!configured && (
            <p className="error" role="status">
              Sign-in is being configured. Please try again later.
            </p>
          )}
          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}
          <button
            onClick={login}
            disabled={busy || loading || !configured}
            className="button full"
          >
            {busy
              ? "Opening Google…"
              : loading
                ? "Getting ready…"
                : "Continue with Google"}
            <ArrowUpRight size={18} />
          </button>
          <small>Free for now. No card. No subscription.</small>
          <Link href="/" className="text-link">
            Back to home
          </Link>
        </section>
      </main>
    </>
  );
}
