'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Link as LinkIcon, FileText, Sparkles } from 'lucide-react';

const mockNotes = `## Summary
This video covers the fundamentals of Machine Learning, including supervised and unsupervised learning approaches, with practical examples.

## Key Concepts
- **Supervised Learning**: Training with labeled data
- **Unsupervised Learning**: Finding patterns in unlabeled data
- **Neural Networks**: Computing systems inspired by biological networks
- **Overfitting**: When a model learns noise instead of signal

## Detailed Notes

### What is Machine Learning?
- A subset of Artificial Intelligence
- Enables computers to learn from data without explicit programming
- Used in recommendation systems, image recognition, NLP

### Types of Machine Learning
- **Supervised**: Classification & Regression
- **Unsupervised**: Clustering & Dimensionality Reduction
- **Reinforcement**: Learning through trial and error

## Quick Review
1. ML is a subset of AI that learns from data
2. Three main types: Supervised, Unsupervised, Reinforcement
3. Overfitting is a key challenge to watch for`;

export default function Demo() {
  const [step, setStep] = useState(0);

  const steps = [
    { icon: LinkIcon, label: 'Paste YouTube Link', color: '#3B82F6' },
    { icon: Sparkles, label: 'AI Processing', color: '#8B5CF6' },
    { icon: FileText, label: 'Get Smart Notes', color: '#06B6D4' },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative" id="demo">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold uppercase tracking-wider text-blue-400 mb-2 block">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Three Steps to{' '}
            <span className="gradient-text">Better Notes</span>
          </h2>
        </motion.div>

        {/* Steps Indicator */}
        <div className="flex items-center justify-center gap-4 mb-12">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.button
                key={i}
                onClick={() => setStep(i)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm transition-all cursor-pointer ${
                  step === i ? 'glow-blue' : ''
                }`}
                style={{
                  background: step === i ? `${s.color}20` : 'var(--surface)',
                  border: `1px solid ${step === i ? `${s.color}50` : 'var(--border-color)'}`,
                  color: step === i ? s.color : 'var(--muted)',
                }}
              >
                <Icon size={16} />
                <span className="hidden sm:inline">{s.label}</span>
                <span className="sm:hidden">{i + 1}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Demo Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card overflow-hidden"
          style={{ padding: 0 }}
        >
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="step-0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-8"
              >
                <div className="max-w-xl mx-auto">
                  <label className="block text-sm font-medium mb-3" style={{ color: 'var(--muted)' }}>
                    YouTube Video URL
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value="https://youtube.com/watch?v=example123"
                      readOnly
                      className="input-field flex-1"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setStep(1)}
                      className="btn-primary cursor-pointer"
                    >
                      <ArrowRight size={18} />
                      <span>Go</span>
                    </motion.button>
                  </div>
                  <p className="text-xs mt-3" style={{ color: 'var(--muted)' }}>
                    ✓ Works with any public YouTube video with available transcripts
                  </p>
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-8 text-center"
              >
                <div className="max-w-md mx-auto">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="w-16 h-16 mx-auto mb-6 rounded-full"
                    style={{
                      border: '3px solid var(--border-color)',
                      borderTopColor: '#3B82F6',
                    }}
                  />
                  <h3 className="text-xl font-semibold mb-2">AI is Processing...</h3>
                  <p className="text-sm mb-6" style={{ color: 'var(--muted)' }}>
                    Extracting transcript and generating structured notes
                  </p>
                  <div className="space-y-3">
                    {['Fetching transcript...', 'Analyzing content...', 'Generating notes...'].map(
                      (text, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.5 }}
                          className="flex items-center gap-2 text-sm"
                          style={{ color: 'var(--muted)' }}
                        >
                          <motion.span
                            className="text-green-400"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: i * 0.5 + 0.3 }}
                          >
                            ✓
                          </motion.span>
                          {text}
                        </motion.div>
                      )
                    )}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setStep(2)}
                    className="btn-primary mt-6 cursor-pointer"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                  >
                    <span>See Results</span>
                    <ArrowRight size={16} />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-8"
              >
                <div className="max-w-3xl mx-auto">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Generated Notes</h3>
                    <div className="flex gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                        Ready
                      </span>
                    </div>
                  </div>
                  <div
                    className="rounded-xl p-6 text-sm leading-relaxed overflow-y-auto"
                    style={{
                      background: 'var(--surface)',
                      border: '1px solid var(--border-color)',
                      maxHeight: '300px',
                      whiteSpace: 'pre-wrap',
                      color: 'var(--muted)',
                    }}
                  >
                    {mockNotes}
                  </div>
                  <div className="flex gap-3 mt-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setStep(0)}
                      className="btn-secondary text-sm cursor-pointer"
                    >
                      Try Another
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
