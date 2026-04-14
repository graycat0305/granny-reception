"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform, MotionValue } from "framer-motion";
import ThreeScene from "./ThreeScene";
import EnvelopeScene from "./EnvelopeScene";
import InvitationLetter from "./InvitationLetter";
import StorySection from "./StorySection";
import DrinkMenu from "./DrinkMenu";
import { Volume2, VolumeX } from "lucide-react";

interface InvitationContainerProps {
  guestName: string;
}

export default function InvitationContainer({ guestName }: InvitationContainerProps) {
  const [scene, setScene] = useState<"envelope" | "main">("envelope");
  const [isLetterOpen, setIsLetterOpen] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  
  // Create a stable ref for the scroll container
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Initialize useScroll with the ref
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const glassScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.05]);
  const glassOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  const handleOpenEnvelope = () => {
    setScene("main");
    setTimeout(() => {
      setIsLetterOpen(true);
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
        ref={containerRef}
        id="main-scroll-container"
        className="relative min-h-[400vh] text-white overflow-x-hidden"
        style={{ position: 'relative', minHeight: '400vh' }}
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
          {scene === "envelope" && (
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
            <div className="h-screen flex flex-col items-center justify-center p-6 text-center">
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
              
              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="mt-24 text-gold/40 text-[10px] tracking-[0.4em] uppercase font-serif"
              >
                往下探尋 初衷與故事
              </motion.div>
            </div>

            <StorySection />
            
            <DrinkMenu />

            <footer className="py-24 border-t border-gold/10 text-center text-gold/40 font-serif text-xs tracking-[0.4em]">
              © 2026 GRANNY BAR • 老奶奶酒會 3rd ANNIVERSARY
            </footer>
          </motion.div>
        </div>

      </main>

      {/* Floating Letter UI (Moved outside main to prevent scrollbar-induced jitter) */}
      <InvitationLetter 
        guestName={guestName} 
        isOpen={isLetterOpen} 
        onClose={() => setIsLetterOpen(false)} 
        onToggle={() => setIsLetterOpen(!isLetterOpen)}
      />
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
