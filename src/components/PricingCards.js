'use client';

import { motion } from 'framer-motion';
import { Check, Zap, Crown, Sparkles } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: '₹0',
    period: 'forever',
    description: 'Get started with basic features',
    icon: Sparkles,
    color: '#3B82F6',
    features: [
      '3 videos per account',
      'Basic notes generation',
      'English language only',
      'Copy to clipboard',
      'Community support',
    ],
    notIncluded: [
      'PDF download',
      'Multi-language',
      'Priority processing',
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Starter',
    price: '₹49',
    period: '/month',
    description: 'Perfect for regular studying',
    icon: Zap,
    color: '#8B5CF6',
    features: [
      '30 videos per month',
      'Advanced notes generation',
      'All 4 languages',
      'PDF download',
      'Q&A generation',
      'Email support',
    ],
    notIncluded: [
      'Priority processing',
    ],
    cta: 'Upgrade to Starter',
    popular: true,
  },
  {
    name: 'Pro',
    price: '₹99',
    period: '/month',
    description: 'Unlimited power for serious students',
    icon: Crown,
    color: '#F59E0B',
    features: [
      'Unlimited videos',
      'Premium notes quality',
      'All 4 languages',
      'PDF download',
      'Q&A generation',
      'Priority processing',
      'Priority support',
      'Early access to features',
    ],
    notIncluded: [],
    cta: 'Upgrade to Pro',
    popular: false,
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

export default function PricingCards({ onUpgradeClick }) {
  const handleUpgrade = (planName) => {
    if (planName === 'Free') {
      window.location.href = '/login';
    } else if (onUpgradeClick) {
      onUpgradeClick(planName);
    } else {
      alert(`${planName} plan coming soon! We're setting up payments.`);
    }
  };

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8" id="pricing">
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
            Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Simple, <span className="gradient-text">Student-Friendly</span> Pricing
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: 'var(--muted)' }}>
            Start free, upgrade when you need more
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
        >
          {plans.map((plan, i) => {
            const Icon = plan.icon;
            return (
              <motion.div
                key={i}
                variants={cardVariants}
                className={`card relative flex flex-col ${
                  plan.popular ? 'glow-blue-strong' : ''
                }`}
                style={
                  plan.popular
                    ? { border: '2px solid rgba(59, 130, 246, 0.5)' }
                    : {}
                }
              >
                {/* Popular badge */}
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold gradient-bg text-white">
                    Most Popular
                  </div>
                )}

                {/* Icon & Name */}
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `${plan.color}15`, border: `1px solid ${plan.color}30` }}
                  >
                    <Icon size={20} style={{ color: plan.color }} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{plan.name}</h3>
                    <p className="text-xs" style={{ color: 'var(--muted)' }}>
                      {plan.description}
                    </p>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-sm" style={{ color: 'var(--muted)' }}>
                    {plan.period}
                  </span>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm">
                      <Check size={16} className="text-green-400 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                  {plan.notIncluded.map((f, j) => (
                    <li
                      key={`no-${j}`}
                      className="flex items-center gap-2 text-sm line-through opacity-40"
                    >
                      <Check size={16} className="shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleUpgrade(plan.name)}
                  className={`w-full py-3 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
                    plan.popular
                      ? 'btn-primary justify-center'
                      : 'btn-secondary'
                  }`}
                  id={`pricing-${plan.name.toLowerCase()}-btn`}
                >
                  <span>{plan.cta}</span>
                </motion.button>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
