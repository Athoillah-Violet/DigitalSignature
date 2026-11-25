import { Lock, FileCheck2, Cpu } from 'lucide-react';

export default function SecuritySection() {
  const pillars = [
    {
      icon: Cpu,
      title: 'Integritas Bit-Level SHA-256',
      desc: 'Setiap byte dari PDF final diproses dengan fungsi hash satu arah. Mengubah satu karakter atau titik piksel saja akan menghasilkan tanda tangan yang tidak cocok.',
    },
    {
      icon: Lock,
      title: 'Kunci Asimetris Server',
      desc: 'Tanda tangan digital dienkripsi dengan kunci privat server yang terlindungi ketat. Publik dapat memvalidasi signature menggunakan kunci publik resmi.',
    },
    {
      icon: FileCheck2,
      title: 'Arsitektur Zero-Storage',
      desc: 'Server tidak pernah menyimpan isi file PDF Anda. Setelah stempel QR dan perhitungan hash selesai, file langsung dikembalikan dan segera dibersihkan dari memori.',
    },
  ];

  return (
    <section className="w-full py-20 sm:py-28 border-t border-[#D6D5CF] bg-[#E4E3DD]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Filosofi / Kutipan Serif Light */}
        <div className="max-w-4xl mx-auto text-center mb-20" data-aos="fade-up">
          <span className="label-mono text-[#555555]">02 // LANDASAN KRIPTOGRAFI</span>
          <blockquote className="text-3xl sm:text-4xl md:text-5xl font-serif-light text-[#111111] italic mt-6 leading-snug">
            &ldquo;Kebenaran suatu dokumen tidak terletak pada stempel visual belaka, melainkan pada integritas matematis yang kebal manipulasi.&rdquo;
          </blockquote>
          <div className="w-12 h-[1px] bg-[#111111] mx-auto mt-8 opacity-40" />
        </div>

        {/* Pilar Keamanan */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                data-aos="fade-up"
                data-aos-delay={idx * 150}
                className="border-t border-[#111111] pt-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <Icon className="w-5 h-5 text-[#111111]" />
                    <h3 className="font-mono text-xs uppercase font-bold tracking-[0.15em] text-[#111111]">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-sm text-[#555555] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
