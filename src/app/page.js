'use client';

import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Demo from '@/components/Demo';
import Testimonials from '@/components/Testimonials';
import PricingCards from '@/components/PricingCards';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <main className="page-enter">
      <Navbar />
      <Hero />
      <Features />
      <Demo />
      <Testimonials />
      <FAQ />
      <PricingCards />
      <Footer />
    </main>
  );
}
