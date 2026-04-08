'use client';

import Navbar from '@/components/Navbar';
import PricingCards from '@/components/PricingCards';
import Footer from '@/components/Footer';

export default function PricingPage() {
  return (
    <main className="min-h-screen page-enter">
      <Navbar />
      <div className="pt-20">
        <PricingCards />
      </div>
      <Footer />
    </main>
  );
}
