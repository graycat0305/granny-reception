import Link from "next/link";
import guests from "@/data/guests.json";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-white text-center">
      <div className="max-w-xl w-full space-y-12">
        <h1 className="font-serif text-5xl md:text-7xl gold-text tracking-[0.2em] leading-tight">
          老奶奶酒會
          <br />
          <span className="text-3xl md:text-5xl block mt-4 opacity-80">酒廠大亨</span>
        </h1>
        
        <div className="h-px bg-gold/20 w-32 mx-auto" />

        <div className="space-y-6">
          <p className="text-gold/80 font-serif tracking-[0.2em] text-lg">
            這裡似乎空無一物...
          </p>
          <p className="text-white/40 font-sans tracking-widest text-sm leading-loose">
            您的專屬邀請函已發送至信箱或簡訊，
            <br />
            請點擊專屬連結進入這場隱密的資本遊戲。
          </p>
        </div>

        <footer className="pt-24 opacity-20 text-[10px] tracking-[0.5em] text-white">
          GRANNY BAR © 2026
        </footer>
      </div>
    </main>
  );
}
