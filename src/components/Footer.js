import Link from "next/link";
export default function Footer() {
  return (
    <footer className="shell footer">
      <Link className="wordmark" href="/">
        infera<span>notes</span>
      </Link>
      <p>Make room for understanding.</p>
      <span>Free for now. Built for your next breakthrough.</span>
    </footer>
  );
}
