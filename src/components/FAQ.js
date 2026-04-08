'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const fAQs = [
  {
    question: "How does it work?",
    answer: "Paste a YouTube link, and our AI fetches the transcript, analyzes it, and generates structured study notes instantly."
  },
  {
    question: "Do I need a paid account?",
    answer: "No, you get 3 free generations to start. After that, you can upgrade to a heavily discounted student plan."
  },
  {
    question: "Can it translate to other languages?",
    answer: "Yes! We support English, Hindi, Hinglish, and Marathi natively."
  },
  {
    question: "Does it work with ANY video?",
    answer: "It works with any public YouTube video that has closed captions or generated subtitles available."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="py-24 relative" id="faq">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Got <span className="gradient-text">Questions?</span>
          </h2>
          <p className="text-lg" style={{ color: 'var(--muted)' }}>
            Everything you need to know about InferaNotes.
          </p>
        </div>

        <div className="space-y-4">
          {fAQs.map((faq, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="card overflow-hidden"
              style={{ cursor: 'pointer', padding: 0 }}
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
            >
              <div className="p-6 flex justify-between items-center bg-white/5 hover:bg-white/10 transition-colors">
                <h3 className="font-semibold text-lg">{faq.question}</h3>
                <motion.div animate={{ rotate: openIndex === idx ? 180 : 0 }}>
                  <ChevronDown className="text-blue-400" />
                </motion.div>
              </div>

              <AnimatePresence>
                {openIndex === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-6 pb-6"
                    style={{ color: 'var(--muted)' }}
                  >
                    <div className="pt-2">{faq.answer}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
