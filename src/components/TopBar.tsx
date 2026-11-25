export default function TopBar() {
  return (
    <div className="w-full bg-[#111111] text-[#E9E8E3] border-b border-[#222222] py-2 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between text-[11px] font-mono tracking-[0.2em] uppercase select-none">
        <div className="flex items-center gap-3">
          <span className="text-[#888888] font-semibold">VERITAS</span>
          <span className="hidden sm:inline text-[#444444]">//</span>
          <span className="hidden sm:inline text-[#AAAAAA]">PROTOKOL TANDA TANGAN & KEASLIAN DIGITAL</span>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2E7D5B] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2E7D5B]" />
          </span>
          <span className="text-[#E9E8E3] font-medium tracking-[0.25em]">SISTEM AKTIF</span>
        </div>
      </div>
    </div>
  );
}
