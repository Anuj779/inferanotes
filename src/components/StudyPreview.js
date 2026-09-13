"use client";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Play, ArrowUpRight, FileText, Check } from "lucide-react";
import NotesDisplay from "./NotesDisplay";
const samples = {
  en: "## The science of remembering\n\n**Active recall** means retrieving information from memory, instead of reading it again.\n\n### Make the idea stick\n- Close your notes and explain the concept.\n- Check what you missed.\n- Return to it after a longer interval.\n\n### Quick check\nWhy does testing yourself help?\n\nIt practices retrieval, the same skill you need in an exam.",
  hi: "## याद रखने का विज्ञान\n\n**Active recall** का अर्थ है जानकारी को दोबारा पढ़ने के बजाय याद करके बताना।\n\n### सीखने का अभ्यास\n- नोट्स बंद करके विषय समझाएँ।\n- जो छूट गया, उसे जाँचें।\n- कुछ समय बाद फिर अभ्यास करें।",
  hinglish:
    "## Yaad rakhne ka science\n\n**Active recall** ka matlab hai memory se answer nikaalna, sirf dobara padhna nahi.\n\n### Concept ko pakka karo\n- Notes band karke concept explain karo.\n- Jo miss hua, use check karo.\n- Thode time baad phir practice karo.",
  mr: "## लक्षात ठेवण्याचे विज्ञान\n\n**Active recall** म्हणजे पुन्हा वाचण्याऐवजी आठवणीतून माहिती सांगण्याचा प्रयत्न करणे.\n\n### संकल्पना पक्की करा\n- नोट्स बंद करून संकल्पना समजावून सांगा.\n- काय राहिले ते तपासा.\n- काही वेळाने पुन्हा सराव करा.",
};
export default function StudyPreview() {
  const [language, setLanguage] = useState("en");
  const reduce = useReducedMotion();
  return (
    <motion.div
      className="study-preview"
      initial={reduce ? false : { y: 30, rotate: 2 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ duration: 0.8, delay: 0.15 }}
    >
      <div className="preview-source">
        <div className="lecture-art">
          <Play size={28} fill="currentColor" />
          <span>THE LEARNING LAB</span>
        </div>
        <div>
          <small>EXAMPLE LECTURE</small>
          <h3>
            Learn it once.
            <br />
            Remember it longer.
          </h3>
          <span className="source-meta">A short lesson in active recall</span>
        </div>
        <ArrowUpRight size={20} />
      </div>
      <div className="preview-connector">
        <span />
        <FileText size={16} />
        <span />
      </div>
      <div className="preview-paper">
        <div className="paper-bar">
          <span>
            <Check size={14} /> Ready for revision
          </span>
          <small>SAMPLE NOTES</small>
        </div>
        <div
          className="language-tabs"
          role="group"
          aria-label="Preview language"
        >
          {Object.entries({
            en: "English",
            hi: "हिन्दी",
            hinglish: "Hinglish",
            mr: "मराठी",
          }).map(([key, label]) => (
            <button
              key={key}
              aria-pressed={language === key}
              onClick={() => setLanguage(key)}
            >
              {label}
            </button>
          ))}
        </div>
        <NotesDisplay notes={samples[language]} preview />
      </div>
    </motion.div>
  );
}
