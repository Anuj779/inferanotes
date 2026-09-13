import Link from "next/link";
export default function Footer() {
  return (
    <footer className="shell footer">
      <Link className="wordmark" href="/">
        infera<span>notes</span>
      </Link>
      <p>
        Make room for understanding. • Made by{" "}
        <a
          href="https://www.linkedin.com/in/anuj-ozare-38b579369?utm_source=share_via&utm_content=profile&utm_medium=member_android"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "underline" }}
        >
          Anuj
        </a>
      </p>
      <span>Free for now. Built for your next breakthrough.</span>
    </footer>
  );
}
