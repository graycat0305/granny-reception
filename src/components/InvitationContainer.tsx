"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform, MotionValue } from "framer-motion";
import ThreeScene from "./ThreeScene";
import EnvelopeScene from "./EnvelopeScene";
import InvitationLetter from "./InvitationLetter";
import DrinkMenu from "./DrinkMenu";
import { Volume2, VolumeX, QrCode, ChevronDown } from "lucide-react";

interface InvitationContainerProps {
  guestName?: string;
  guestId?: string;
  hasTicket?: boolean;
  hasAttended?: boolean;
  isPublicView?: boolean;
}

export default function InvitationContainer({ guestName = "", guestId = "", hasTicket = false, hasAttended = false, isPublicView = false }: InvitationContainerProps) {
  const [scene, setScene] = useState<"envelope" | "main">(isPublicView ? "main" : "envelope");
  const [isLetterOpen, setIsLetterOpen] = useState(false);
  const [hasStarted, setHasStarted] = useState(isPublicView);
  const [isMuted, setIsMuted] = useState(false);
  const [localHasAttended, setLocalHasAttended] = useState(hasAttended);

  useEffect(() => {
    // If already attended or the letter is closed or no guestId, no need to poll
    if (localHasAttended || !isLetterOpen || !guestId) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/checkin/status?guestId=${guestId}`);
        const data = await res.json();
        if (data.success && data.hasAttended) {
          setLocalHasAttended(true);
        }
      } catch (err) {
        console.error("Failed to poll checkin status", err);
      }
    }, 5000); // Increased interval to 5s to reduce server load

    return () => clearInterval(interval);
  }, [guestId, localHasAttended, isLetterOpen]);
  
  // Create a stable ref for the scroll container
  // Initialize useScroll for the entire window
  const { scrollY } = useScroll();

  // Use absolute scroll distance (pixels) so it's independent of total page height
  const glassScale = useTransform(scrollY, [0, 500], [1, 0.05]);
  const glassOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  const handleOpenEnvelope = () => {
    setScene("main");
    setIsLetterOpen(true);
    setTimeout(() => {
      setHasStarted(true);
    }, 500);
  };

  const bgImage = "/672681249_1807783616846203_239851695741961621_n.jpg";

  return (
    <div 
      className="relative w-full" 
      style={{ position: 'relative' }} // Outer wrapper ensures relative context
    >
      <main 
        id="main-scroll-container"
        className="relative text-white overflow-x-hidden"
        style={{ position: 'relative' }}
      >
        {/* Background Image Layer */}
        <div 
          className="fixed inset-0 -z-30 bg-center bg-cover bg-no-repeat"
          style={{ 
            backgroundImage: `url('${bgImage}')`,
            opacity: 0.6,
            position: 'fixed'
          }}
        />
        <div className="fixed inset-0 -z-20 bg-gradient-to-b from-black/70 via-black/20 to-black/90 pointer-events-none" />

        {/* 3D Glass Layer */}
        <SceneWrapper scale={glassScale} opacity={glassOpacity} />

        {/* Music Toggle */}
        {hasStarted && (
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="fixed bottom-6 left-6 z-[70] p-3 rounded-full bg-black/40 border border-gold/30 backdrop-blur-md hover:bg-gold/10 transition-colors"
          >
            {isMuted ? <VolumeX className="text-gold" /> : <Volume2 className="text-gold" />}
          </button>
        )}

        {/* Overlay Screens */}
        <AnimatePresence>
          {scene === "envelope" && !isPublicView && (
            <EnvelopeScene onOpen={handleOpenEnvelope} />
          )}
        </AnimatePresence>

        {/* Main Content (Scrollable) */}
        <div className={scene === "main" ? "block" : "hidden"}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
            className="relative z-10"
          >
            {/* Hero Section */}
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center pt-20">
              <motion.h1 
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                className="font-serif text-5xl md:text-8xl gold-text tracking-widest mb-4 drop-shadow-2xl"
              >
                老奶奶酒會
                <span className="block text-2xl md:text-4xl mt-6 opacity-90 tracking-[0.5em]">酒廠大亨</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                viewport={{ once: true }}
                className="text-gold/80 font-accent text-lg md:text-xl tracking-[0.4em] uppercase"
              >
                The 3rd Anniversary Luxury Gathering
              </motion.p>
              
              {/* Action Buttons Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                viewport={{ once: true }}
                className="mt-16 flex flex-col sm:flex-row gap-6 items-center justify-center w-full max-w-lg z-20"
              >
                <a 
                  href="https://forms.gle/Wn2ADNt7VC4qczSw7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full px-8 py-4 border border-gold/30 rounded-sm bg-black/40 backdrop-blur-md text-gold hover:bg-gold/90 hover:text-black transition-all duration-500 font-serif tracking-[0.2em] text-sm flex items-center justify-center gap-3 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gold/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                  <QrCode className="w-5 h-5 relative z-10" />
                  <span className="relative z-10">點酒表單</span>
                </a>
                <a 
                  href="https://t.me/+VXhif8r3ZeMxZWI1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full px-8 py-4 border border-gold/30 rounded-sm bg-black/40 backdrop-blur-md text-gold hover:bg-gold/90 hover:text-black transition-all duration-500 font-serif tracking-[0.2em] text-sm flex items-center justify-center gap-3 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gold/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                  <QrCode className="w-5 h-5 relative z-10" />
                  <span className="relative z-10">群組邀請</span>
                </a>
              </motion.div>

              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="mt-24 mb-12 flex flex-col items-center gap-4 text-gold/40 text-[10px] tracking-[0.4em] uppercase font-serif"
              >
                <span>繼續往下以探索酒單口味</span>
                <ChevronDown className="w-4 h-4 opacity-70" />
              </motion.div>
            </div>
            
            <DrinkMenu />

            <footer className="py-24 border-t border-gold/10 text-center text-gold/40 font-serif text-xs tracking-[0.4em]">
              © 2026 GRANNY&apos;S BAR <br /> 老奶奶酒會 3rd ANNIVERSARY
            </footer>
          </motion.div>
        </div>

      </main>

      {/* Floating Letter UI (Moved outside main to prevent scrollbar-induced jitter) */}
      {scene === "main" && !isPublicView && (
        <InvitationLetter 
          guestName={guestName} 
          guestId={guestId}
          hasTicket={hasTicket}
          hasAttended={localHasAttended}
          isOpen={isLetterOpen} 
          onClose={() => setIsLetterOpen(false)} 
          onToggle={() => setIsLetterOpen(!isLetterOpen)}
        />
      )}
    </div>
  );
}

function SceneWrapper({ scale, opacity }: { scale: MotionValue<number>, opacity: MotionValue<number> }) {
  const [s, setS] = useState(1);
  const [o, setO] = useState(1);

  useEffect(() => {
    const unsubScale = scale.on("change", (v) => setS(v));
    const unsubOpacity = opacity.on("change", (v) => setO(v));
    return () => {
      unsubScale();
      unsubOpacity();
    };
  }, [scale, opacity]);

  return <ThreeScene scrollScale={s} scrollOpacity={o} />;
}
