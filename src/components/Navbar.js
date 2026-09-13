"use client";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";
import { Moon, Sun, ArrowUpRight } from "lucide-react";
export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  return (
    <header className="site-header">
      <div className="header-credit-bar">
        Made by{" "}
        <a
          href="https://www.linkedin.com/in/anuj-ozare-38b579369?utm_source=share_via&utm_content=profile&utm_medium=member_android"
          target="_blank"
          rel="noopener noreferrer"
        >
          Anuj
        </a>
      </div>
      <nav className="shell nav" aria-label="Main navigation">
        <Link href="/" className="wordmark">
          infera<span>notes</span>
          <span className="brand-mark">↗</span>
        </Link>
        <div className="nav-center">
          <Link href="/#how-it-works">How it works</Link>
          <Link href="/#questions">Questions</Link>
        </div>
        <div className="nav-actions">
          <button
            className="icon-button"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
            onClick={toggleTheme}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <Link href="/dashboard" className="button small">
            Start studying
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </nav>
    </header>
  );
}
