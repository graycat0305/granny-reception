"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface EnvelopeSceneProps {
    onOpen: () => void;
}

export default function EnvelopeScene({ onOpen }: EnvelopeSceneProps) {
    const [isSealCracked, setIsSealCracked] = useState(false);
    const [isFlapOpen, setIsFlapOpen] = useState(false);
    const [isLetterExtracting, setIsLetterExtracting] = useState(false);

    const handleOpen = () => {
        if (isSealCracked) return;
        setIsSealCracked(true);
        
        setTimeout(() => {
            setIsFlapOpen(true);
            
            // Wait for flap to fully open
            setTimeout(() => {
                setIsLetterExtracting(true);
                
                // 確保信件飛離畫面的視覺有足夠時間呈現 (1.5s)
                setTimeout(() => {
                    onOpen();
                }, 1500); 
            }, 800);
        }, 500);
    };

    return (
        <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            exit={{ opacity: 0 }} // 去掉 Blur，防止視覺干擾飛離效果
            transition={{ duration: 0.5 }}
        >
            <motion.div 
                className="relative perspective-distant"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                {/* Envelope Container */}
                <div className="relative w-80 h-56 md:w-[480px] md:h-[320px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-visible">
                    
                    {/* 1. Back Panel of Envelope */}
                    <div className="absolute inset-0 bg-[#151515] shadow-inner" />

                    {/* 2. Top Flap (Animated: flips back and stays there) */}
                    <motion.div 
                        className="absolute top-0 left-0 w-full h-full bg-[#222]"
                        style={{ 
                            clipPath: "polygon(0 0, 100% 0, 50% 50%)",
                            transformOrigin: "top"
                        }}
                        initial={{ rotateX: 0, zIndex: 30 }}
                        animate={isFlapOpen ? { rotateX: 180, zIndex: 0 } : { rotateX: 0, zIndex: 30 }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                    />

                    {/* 3. The Letter (Tucked inside, then slides up) */}
                    <motion.div
                        className="absolute top-2 left-1/2 -translate-x-1/2 w-[94%] h-[95%] bg-[#fdfaf3] shadow-sm flex flex-col items-center p-8"
                        style={{ backgroundImage: "url('/paper-texture.png')", backgroundSize: "cover" }}
                        initial={{ y: 0, zIndex: 10, scale: 1 }}
                        animate={isLetterExtracting ? { y: -1000, scale: 0.4 } : { y: 0, scale: 1 }}
                        transition={{ duration: 1, ease: "easeInOut" }}
                    >
                        {/* A simple placeholder layout replicating the actual letter content layout */}
                        <div className="w-24 h-1 bg-gold opacity-40 mb-8" />
                        <div className="w-48 h-8 flex flex-col items-center justify-around mb-8">
                            <div className="w-2/3 h-1 bg-stone-300 opacity-60" />
                            <div className="w-full h-1 bg-stone-300 opacity-60" />
                        </div>
                        <div className="w-24 h-24 rounded-full border border-gold opacity-30 mt-auto" />
                    </motion.div>

                    {/* 4. Front Flaps (Proper Layering: ALWAYS above the inserted letter) */}
                    {/* Left Flap */}
                    <div 
                        className="absolute inset-0 bg-gradient-to-r from-[#1a1a1a] to-[#111] z-20" 
                        style={{ clipPath: "polygon(0 0, 50% 50%, 0 100%)" }} 
                    />
                    {/* Right Flap */}
                    <div 
                        className="absolute inset-0 bg-gradient-to-l from-[#1a1a1a] to-[#111] z-20" 
                        style={{ clipPath: "polygon(100% 0, 100% 100%, 50% 50%)" }} 
                    />
                    {/* Bottom Flap */}
                    <div 
                        className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] to-[#151515] z-20 border-t border-white/5 shadow-[0_-5px_10px_rgba(0,0,0,0.2)]" 
                        style={{ clipPath: "polygon(0 100%, 100% 100%, 50% 50%)" }} 
                    />
                    
                    {/* 5. Wax Seal */}
                    <AnimatePresence>
                        {!isFlapOpen && (
                            <motion.div 
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 cursor-pointer"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onPointerDown={handleOpen} // Immediate response
                                exit={{ scale: 2, opacity: 0, filter: "blur(10px)" }}
                            >
                                <div className="relative w-16 h-16 md:w-24 md:h-24">
                                    <Image 
                                        src="/wax-seal.png" 
                                        alt="Wax Seal" 
                                        fill 
                                        priority
                                        sizes="(max-width: 768px) 96px, 128px"
                                        className={cn(
                                            "object-contain transition-transform duration-500",
                                            isSealCracked && "scale-110 opacity-50"
                                        )}
                                    />
                                    {isSealCracked && (
                                        <motion.div 
                                            className="absolute inset-0 flex items-center justify-center"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                        >
                                            <div className="w-full h-1 bg-gold/50 rotate-45 blur-sm" />
                                            <div className="w-full h-1 bg-gold/50 -rotate-45 blur-sm absolute" />
                                        </motion.div>
                                    )}
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
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            exit={{ opacity: 0 }}
                        >
                            <p className="text-gold font-serif tracking-[0.3em] text-sm md:text-base">
                                老奶奶酒會：酒廠大亨
                            </p>
                            <p className="text-white/40 font-serif tracking-[0.2em] text-[10px] md:text-xs">
                                點擊蠟封開啟專屬邀請
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    );
}
