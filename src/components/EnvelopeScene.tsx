"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ElegantSeal = ({ onClick }: { onClick?: () => void }) => (
    <motion.div 
        onClick={onClick}
        className="absolute top-[60%] left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer z-40 text-gold"
        whileHover={{ scale: 1.1, filter: "drop-shadow(0 0 15px rgba(212,175,55,0.5))" }}
        whileTap={{ scale: 0.95 }}
        style={{ filter: "drop-shadow(0 0 8px rgba(212,175,55,0.2))" }}
    >
        <svg width="64" height="64" viewBox="0 0 64 64" className="overflow-visible">
            {/* Diamond shape */}
            <path d="M 32 2 L 62 32 L 32 62 L 2 32 Z" fill="#0a0a0a" stroke="currentColor" strokeWidth="1.5" />
            {/* Inner diamond */}
            <path d="M 32 8 L 56 32 L 32 56 L 8 32 Z" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
            <text x="33" y="37" fontSize="16" fontFamily="serif" textAnchor="middle" fill="currentColor" letterSpacing="0.1em">GR</text>
        </svg>
    </motion.div>
);

interface EnvelopeSceneProps {
    onOpen: () => void;
}

export default function EnvelopeScene({ onOpen }: EnvelopeSceneProps) {
    const [isFlapOpen, setIsFlapOpen] = useState(false);

    const handleOpenEnvelope = () => {
        setIsFlapOpen(true);
        setTimeout(() => {
            onOpen(); // Trigger the main scene to start, which opens the InvitationLetter
        }, 400); // Wait for flap to open
    };

    return (
        <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md pt-[15vh] pb-24"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <motion.div 
                className="relative perspective-[1200px] shrink-0 w-full max-w-[320px] md:max-w-[480px] aspect-[1.6]"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                {/* Envelope Container */}
                <div className="relative w-full h-full shadow-[0_20px_50px_rgba(0,0,0,0.8)] mx-auto">
                    
                    {/* 1. Stationary part (Back panel, Side and Bottom flaps) */}
                    <svg viewBox="0 0 480 300" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                        {/* Back panel */}
                        <rect x="0" y="0" width="480" height="300" fill="#0a0a0a" stroke="#D4AF37" strokeWidth="1" opacity="0.8" />
                        {/* Side and Bottom flaps */}
                        <path d="M 0 0 L 240 180 L 480 0 L 480 300 L 0 300 Z" fill="#111111" stroke="#D4AF37" strokeWidth="1.5" strokeLinejoin="round" />
                        {/* Fold lines for elegance */}
                        <path d="M 0 300 L 240 180 L 480 300" fill="none" stroke="#D4AF37" strokeWidth="0.5" opacity="0.3" />
                    </svg>

                    {/* 2. Top Flap (Animated) */}
                    <motion.div 
                        className="absolute top-0 left-0 w-full h-full origin-top"
                        initial={{ rotateX: 0, zIndex: 30 }}
                        animate={isFlapOpen ? { rotateX: 180, zIndex: 5 } : { rotateX: 0, zIndex: 30 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                    >
                        <svg viewBox="0 0 480 300" className="w-full h-full drop-shadow-lg" preserveAspectRatio="none">
                            <path d="M 0 0 L 240 180 L 480 0 Z" fill="#151515" stroke="#D4AF37" strokeWidth="1.5" strokeLinejoin="round" />
                        </svg>
                    </motion.div>
                    
                    {/* 3. Minimalist Seal */}
                    <AnimatePresence>
                        {!isFlapOpen && (
                            <motion.div 
                                className="absolute inset-0 z-40 pointer-events-none"
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                transition={{ duration: 0.4 }}
                            >
                                <div className="pointer-events-auto">
                                    <ElegantSeal onClick={handleOpenEnvelope} />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Floating Instruction */}
                <AnimatePresence>
                    {!isFlapOpen && (
                        <motion.div 
                            className="absolute -bottom-20 left-1/2 -translate-x-1/2 text-center space-y-2 whitespace-nowrap pointer-events-none"
                            animate={{ opacity: [0.3, 0.8, 0.3] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            exit={{ opacity: 0 }}
                        >
                            <p className="text-[#D4AF37] font-serif tracking-[0.3em] text-sm md:text-base uppercase">
                                老奶奶酒會：酒廠大亨
                            </p>
                            <p className="text-white/30 font-serif tracking-[0.2em] text-[10px] md:text-xs">
                                點擊印記開啟專屬邀請
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    );
}

