import { Navbar } from '@/components/landing/Navbar';
import { Hero } from '@/components/landing/Hero';
import { SocialProof } from '@/components/landing/SocialProof';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { DriverCTA } from '@/components/landing/DriverCTA';
import { SafetyTrust } from '@/components/landing/SafetyTrust';
import { AppDownload } from '@/components/landing/AppDownload';
import { FAQ } from '@/components/landing/FAQ';
import { Footer } from '@/components/landing/Footer';

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <SocialProof />
        <HowItWorks />
        <DriverCTA />
        <SafetyTrust />
        <AppDownload />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
