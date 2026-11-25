import { FileUp, QrCode, KeyRound, CheckCircle2 } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Unggah Dokumen',
      icon: FileUp,
      desc: 'Pengguna mengunggah dokumen PDF asli (hingga 10 MB) dan menentukan nama penandatangan yang sah.',
      detail: 'Format murni PDF // Validasi magic bytes',
    },
    {
      number: '02',
      title: 'Stempel QR Code',
      icon: QrCode,
      desc: 'Server membuat ID pendek unik dan menempelkan QR code serta identitas penandatangan pada halaman dokumen.',
      detail: 'Tautan unik verifikasi // Resolusi presisi',
    },
    {
      number: '03',
      title: 'Tanda Tangan Digital',
      icon: KeyRound,
      desc: 'Nilai SHA-256 dari PDF final dihitung, kemudian dienkripsi menggunakan kunci privat server menjadi signature digital.',
      detail: 'Kriptografi asimetris // RSA-2048 / P-256',
    },
    {
      number: '04',
      title: 'Unduh & Cek Keaslian',
      icon: CheckCircle2,
      desc: 'Unduh file bertanda tangan. Siapa pun dapat memindai QR atau mengunggah file untuk membuktikan keasliannya.',
      detail: 'Bukti matematis // Deteksi modifikasi',
    },
  ];

  return (
    <section id="cara-kerja" className="w-full py-20 sm:py-28 border-t border-[#D6D5CF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6" data-aos="fade-up">
          <div>
            <span className="label-mono text-[#555555]">01 // ALUR PROTOKOL</span>
            <h2 className="text-3xl sm:text-5xl font-serif-light text-[#111111] mt-2">
              Bagaimana VERITAS Bekerja
            </h2>
          </div>
          <p className="font-mono text-xs text-[#555555] max-w-sm uppercase tracking-wider">
            Alur tanda tangan satu arah yang dirancang untuk mencegah pemalsuan tanpa menyimpan file Anda di server.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                data-aos="fade-up"
                data-aos-delay={index * 120}
                className="group border border-[#D6D5CF] bg-[#FAF9F5]/40 hover:bg-[#FAF9F5] p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:border-[#111111] relative"
              >
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <span className="font-mono text-xl font-bold text-[#111111] group-hover:translate-x-1 transition-transform">
                      {step.number}
                    </span>
                    <div className="p-2.5 border border-[#D6D5CF] bg-[#E9E8E3] group-hover:bg-[#111111] group-hover:text-[#E9E8E3] transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="font-sans font-bold text-lg text-[#111111] uppercase tracking-wide mb-3">
                    {step.title}
                  </h3>

                  <p className="text-sm text-[#555555] leading-relaxed mb-8">
                    {step.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#D6D5CF]/60">
                  <span className="label-mono text-[10px] text-[#777777]">
                    {step.detail}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
