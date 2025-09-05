import React from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import PricingSection from '@/components/PricingSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import FloatingChatBubbles from '@/components/FloatingChatBubbles';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section id="home">
          <HeroSection />
        </section>
        <PricingSection />
        <ContactSection />
      </main>
      <Footer />
      <FloatingChatBubbles />
    </div>
  );
};

export default Index;
