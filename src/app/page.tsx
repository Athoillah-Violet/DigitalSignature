import TopBar from '@/components/TopBar';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import HowItWorks from '@/components/HowItWorks';
import SecuritySection from '@/components/SecuritySection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#E9E8E3] text-[#111111]">
      {/* 1. Top Bar Hitam Tipis */}
      <TopBar />

      {/* 2. Navbar Minimalis */}
      <Navbar />

      {/* 3. Hero Section (Teks Raksasa + Timbangan Melayang + Tombol Aksi) */}
      <main className="flex-1 flex flex-col">
        <Hero />

        {/* 4. Section Cara Kerja (4 Langkah Bernomor) */}
        <HowItWorks />

        {/* 5. Section Teknologi & Keamanan (Kutipan Serif Light + 3 Pilar) */}
        <SecuritySection />
      </main>

      {/* 6. Footer Monokrom */}
      <Footer />
    </div>
  );
}
