import Hero from '@/components/Hero';
import Partners from '@/components/Partners';
import About from '@/components/About';
import ImpactMetrics from '@/components/ImpactMetrics';
import ProgramsPreview from '@/components/ProgramsPreview';
import CommunityPreview from '@/components/CommunityPreview';
import DonateCTA from '@/components/DonateCTA';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="relative">
      <Hero />
      <Partners />
      <About />
      <ImpactMetrics />
      <ProgramsPreview />
      <CommunityPreview />
      <DonateCTA />
      <Footer />
    </main>
  );
}

