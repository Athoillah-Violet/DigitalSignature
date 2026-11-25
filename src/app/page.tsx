export default function Home() {
  return (
    <main className="min-h-screen flex flex-col justify-between p-6 sm:p-12 relative overflow-hidden">
      {/* Top Bar Test */}
      <div className="flex items-center justify-between border-b border-[#D6D5CF] pb-4">
        <span className="label-mono text-[#555555]">VERITAS // PROTOKOL KEASLIAN</span>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#2E7D5B] animate-blink" />
          <span className="label-mono text-[#111111]">SISTEM AKTIF</span>
        </div>
      </div>

      {/* Hero Test Container */}
      <div className="my-auto py-16 flex flex-col items-center justify-center text-center relative">
        <h1 className="title-giant text-[#111111] opacity-90 select-none">
          VERITAS
        </h1>

        <p
          className="font-serif-light text-2xl sm:text-3xl italic text-[#555555] max-w-xl mt-4"
          data-aos="fade-up"
        >
          Kebenaran sebuah dokumen tidak ditentukan oleh klaim, melainkan oleh integritas kriptografi yang tak terbantahkan.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mt-8" data-aos="fade-up" data-aos-delay="200">
          <button type="button" className="btn-black">
            BUAT TANDA TANGAN →
          </button>
          <button type="button" className="btn-outline">
            CEK KEASLIAN
          </button>
        </div>

        {/* Animation Test Box */}
        <div className="mt-12 flex flex-col items-center">
          <div className="animate-float w-16 h-16 border border-[#111111] flex items-center justify-center font-mono text-xs">
            FLOAT
          </div>
          <div className="animate-pulse-soft w-12 h-2 rounded-full bg-[#111111]/30 mt-3 blur-xs" />
        </div>
      </div>

      {/* Footer Test */}
      <div className="flex flex-col sm:flex-row items-center justify-between border-t border-[#D6D5CF] pt-4 gap-2">
        <span className="label-mono text-[#555555]">SHA-256 / RSA-2048</span>
        <span className="label-mono text-[#555555]">FONDASE DESAIN VERITAS 2026</span>
      </div>
    </main>
  );
}
