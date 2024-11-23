import HeroBanner from '../components/home/HeroBanner';
import Features from '../components/home/Features';
import Pricing from '../components/home/Pricing';

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroBanner />
      <Features />
      <Pricing />
    </main>
  );
}