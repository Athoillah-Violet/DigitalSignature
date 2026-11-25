import ScaleIllustration from "@/components/ScaleIllustration";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col justify-between p-6 sm:p-12 relative overflow-hidden bg-[#E9E8E3]">
      {/* Top Bar Test */}
      <div className="flex items-center justify-between border-b border-[#D6D5CF] pb-4 z-20">
        <span className="label-mono text-[#555555]">VERITAS // PROTOKOL KEASLIAN</span>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#2E7D5B] animate-blink" />
          <span className="label-mono text-[#111111]">SISTEM AKTIF</span>
        </div>
      </div>

      {/* Hero Test Container */}
      <div className="my-auto py-12 flex flex-col items-center justify-center text-center relative w-full max-w-7xl mx-auto">
        {/* Giant Text in background (z-0) */}
        <h1 className="title-giant text-[#111111] select-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none opacity-85">
          VERITAS
        </h1>

        {/* Floating Scale Illustration overlapping text (z-10) */}
        <div className="relative z-10 flex flex-col items-center justify-center my-6">
          <div className="animate-float w-64 sm:w-80 md:w-96 max-w-[85vw] transition-transform">
            <ScaleIllustration className="w-full h-auto drop-shadow-md" />
          </div>

          {/* Pulsing Blur Ellipse Shadow */}
          <div className="animate-pulse-soft w-48 sm:w-60 md:w-72 h-4 rounded-[100%] bg-[#111111]/25 blur-md -mt-4 pointer-events-none" />
        </div>

        {/* Serif Light Quote */}
        <p
          className="font-serif-light text-2xl sm:text-3xl italic text-[#555555] max-w-xl mt-6 z-20 relative"
          data-aos="fade-up"
        >
          Kebenaran sebuah dokumen tidak ditentukan oleh klaim, melainkan oleh integritas kriptografi yang tak terbantahkan.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-8 z-20 relative" data-aos="fade-up" data-aos-delay="200">
          <button type="button" className="btn-black">
            BUAT TANDA TANGAN →
          </button>
          <button type="button" className="btn-outline">
            CEK KEASLIAN
          </button>
        </div>
      </div>

      {/* Footer Test */}
      <div className="flex flex-col sm:flex-row items-center justify-between border-t border-[#D6D5CF] pt-4 gap-2 z-20">
        <span className="label-mono text-[#555555]">SHA-256 / RSA-2048</span>
        <span className="label-mono text-[#555555]">ASET TIMBANGAN VERITAS 2026</span>
      </div>
    </main>
  );
}
