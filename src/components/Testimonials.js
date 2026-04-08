'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Engineering Student',
    avatar: '👩‍🎓',
    text: 'InferaNotes saves me hours of note-taking. I just paste the lecture link and get perfect exam notes in Hindi. Game changer for my preparation!',
    rating: 5,
  },
  {
    name: 'Rahul Patel',
    role: 'Medical Student',
    avatar: '👨‍⚕️',
    text: 'The Q&A generation feature is incredible. It predicts exactly the kind of questions that come in exams. The Hinglish option makes complex topics so easy to understand.',
    rating: 5,
  },
  {
    name: 'Ananya Deshmukh',
    role: 'Commerce Student',
    avatar: '👩‍💼',
    text: 'I love the PDF download feature. I can convert any YouTube tutorial into organized study notes and print them. The Marathi language support is amazing!',
    rating: 5,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Testimonials() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative bg-dots">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold uppercase tracking-wider text-blue-400 mb-2 block">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Loved by <span className="gradient-text">Students</span>
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: 'var(--muted)' }}>
            See what students are saying about InferaNotes
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              variants={cardVariants}
              className="card relative group"
            >
              {/* Quote icon */}
              <Quote
                size={32}
                className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity"
                style={{ color: '#3B82F6' }}
              />

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} size={14} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Text */}
              <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--muted)' }}>
                &ldquo;{t.text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                  style={{ background: 'var(--surface)', border: '1px solid var(--border-color)' }}
                >
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs" style={{ color: 'var(--muted)' }}>
                    {t.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
