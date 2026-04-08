'use client';

import { motion } from 'framer-motion';
import {
  Zap,
  Languages,
  FileText,
  BookOpen,
  Download,
  Shield,
} from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Instant Notes',
    description: 'Paste a YouTube link and get structured notes in seconds. No manual work needed.',
    color: '#3B82F6',
  },
  {
    icon: Languages,
    title: 'Multi-Language',
    description: 'Get notes in English, Hindi, Hinglish, or Marathi. Perfect for Indian students.',
    color: '#06B6D4',
  },
  {
    icon: FileText,
    title: 'Exam-Ready Format',
    description: 'Notes come with headings, key concepts, bullet points, and quick review sections.',
    color: '#8B5CF6',
  },
  {
    icon: BookOpen,
    title: 'Auto Q&A',
    description: 'AI generates potential exam questions and answers from the video content.',
    color: '#F59E0B',
  },
  {
    icon: Download,
    title: 'Download PDF',
    description: 'Export your notes as clean PDFs ready for printing or offline study.',
    color: '#10B981',
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'We only process publicly available transcripts. No video content is ever stored.',
    color: '#EF4444',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Features() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative" id="features">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold uppercase tracking-wider text-blue-400 mb-2 block">
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Everything You Need to{' '}
            <span className="gradient-text">Study Smarter</span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--muted)' }}>
            Powered by advanced AI to transform any YouTube lecture into perfect study material.
          </p>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={i}
                variants={cardVariants}
                className="card group cursor-default"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110"
                  style={{
                    background: `${feature.color}15`,
                    border: `1px solid ${feature.color}30`,
                  }}
                >
                  <Icon size={24} style={{ color: feature.color }} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
                  {feature.description}
                </p>
                {/* Hover glow */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at center, ${feature.color}08, transparent 70%)`,
                  }}
                />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
