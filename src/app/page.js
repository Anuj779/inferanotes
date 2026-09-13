import Link from "next/link";
import {
  ArrowUpRight,
  ArrowRight,
  Languages,
  NotebookPen,
  Download,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StudyPreview from "@/components/StudyPreview";
const faqs = [
  [
    "Is InferaNotes free?",
    "Yes. All four languages, study notes, practice questions and exports are free for now. Daily fair-use limits keep the shared AI service available. There is no subscription or payment.",
  ],
  [
    "Will every YouTube video work?",
    "Public videos with available captions work best. If captions cannot be retrieved, paste the video transcript in your workspace. Private videos and very long transcripts are not supported.",
  ],
  [
    "Can I trust the notes?",
    "Use the notes as a study aid and check important details against the original lecture. AI can make mistakes, and captions can contain errors.",
  ],
  [
    "What happens to my data?",
    "No sign-in needed. Your guest notebook is linked to this browser; clearing site data or switching devices loses access, so download important notes. Transcripts are sent to the configured AI provider; we do not store video files. Avoid sensitive material.",
  ],
];
export default function HomePage() {
  return (
    <>
      <Navbar />
      <main id="main">
        <section className="shell hero">
          <div className="hero-copy">
            <p className="eyebrow">YOUR NEXT STUDY SESSION, REIMAGINED</p>
            <h1>
              Less replay.
              <br />
              <span>More recall.</span>
            </h1>
            <p className="hero-description">
              Turn YouTube lectures into notes you actually want to study. In
              your language. At your pace.
            </p>
            <div className="hero-actions">
              <Link href="/dashboard" className="button">
                Start studying <ArrowUpRight size={20} />
              </Link>
              <a href="#how-it-works" className="text-link">
                Take a look <ArrowRight size={17} />
              </a>
            </div>
          </div>
          <StudyPreview />
        </section>
        <div className="shell capability-strip">
          <span>Made for the way you learn</span>
          <span>English</span>
          <span>हिन्दी</span>
          <span>Hinglish</span>
          <span>मराठी</span>
        </div>
        <section className="shell section" id="how-it-works">
          <div className="section-heading">
            <h2>
              A whole lecture.
              <br />
              <span>A little more clarity.</span>
            </h2>
            <p>From the first explanation to your last-minute revision.</p>
          </div>
          <div className="feature-grid">
            <div className="feature primary-feature">
              <NotebookPen size={28} />
              <h3>
                Keep the ideas.
                <br />
                Skip the endless replay.
              </h3>
              <p>
                Paste a lecture link. Get the summary, key concepts, detailed
                notes and practice questions together.
              </p>
              <div className="workflow">
                <span>Lecture</span>
                <ArrowRight size={16} />
                <span>Understanding</span>
                <ArrowRight size={16} />
                <span>Recall</span>
              </div>
            </div>
            <div className="feature">
              <Languages size={25} />
              <h3>Think in your language.</h3>
              <p>
                English, Hindi, Hinglish or Marathi. Technical terms stay
                recognizable.
              </p>
              <div className="type-art" aria-hidden="true">
                Aa <span>अ</span>
              </div>
            </div>
            <div className="feature export-feature">
              <Download size={25} />
              <div>
                <h3>Your notes. Anywhere.</h3>
                <p>
                  Copy, download Markdown or save a PDF through your browser.
                  Every export is free.
                </p>
              </div>
              <span className="file-label">.md / .pdf</span>
            </div>
          </div>
        </section>
        <section className="shell section questions" id="questions">
          <h2>
            A few things
            <br />
            <span>before you begin.</span>
          </h2>
          <div>
            {faqs.map(([q, a]) => (
              <details key={q}>
                <summary>
                  {q}
                  <span>+</span>
                </summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </section>
        <section className="shell closing">
          <p>That lecture you saved for later?</p>
          <h2>Make later happen.</h2>
          <Link href="/dashboard" className="button">
            Start studying <ArrowUpRight size={19} />
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
