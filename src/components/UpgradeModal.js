'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Crown, Check, Zap } from 'lucide-react';

export default function UpgradeModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const plans = [
    {
      name: 'Starter',
      price: '₹49/mo',
      features: ['30 videos/month', 'All languages', 'PDF download'],
      color: '#8B5CF6',
      icon: Zap,
    },
    {
      name: 'Pro',
      price: '₹99/mo',
      features: ['Unlimited videos', 'Priority processing', 'Premium support'],
      color: '#F59E0B',
      icon: Crown,
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="card max-w-lg w-full relative"
            onClick={(e) => e.stopPropagation()}
            style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1 rounded-lg hover:bg-white/10 transition cursor-pointer"
              id="upgrade-modal-close"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl gradient-bg flex items-center justify-center">
                <Crown size={32} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Free Limit Reached</h2>
              <p className="text-sm" style={{ color: 'var(--muted)' }}>
                You&apos;ve used all 3 free video conversions. Upgrade to continue learning!
              </p>
            </div>

            {/* Plans */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {plans.map((plan, i) => {
                const Icon = plan.icon;
                return (
                  <div
                    key={i}
                    className="p-4 rounded-xl transition-all hover:scale-105 cursor-pointer"
                    style={{
                      background: 'var(--surface)',
                      border: '1px solid var(--border-color)',
                    }}
                    onClick={() => alert(`${plan.name} plan coming soon!`)}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Icon size={18} style={{ color: plan.color }} />
                      <span className="font-semibold">{plan.name}</span>
                    </div>
                    <p className="text-2xl font-bold mb-3">{plan.price}</p>
                    <ul className="space-y-2">
                      {plan.features.map((f, j) => (
                        <li key={j} className="flex items-center gap-2 text-xs">
                          <Check size={12} className="text-green-400" />
                          <span style={{ color: 'var(--muted)' }}>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <p className="text-xs text-center" style={{ color: 'var(--muted)' }}>
              Payment integration coming soon. Stay tuned! 🚀
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
