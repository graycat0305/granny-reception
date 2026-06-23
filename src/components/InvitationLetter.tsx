"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface InvitationLetterProps {
    guestName: string;
    guestId: string;
    hasTicket: boolean;
    hasAttended?: boolean;
    isOpen: boolean;
    onClose: () => void;
    onToggle: () => void;
}

export default function InvitationLetter({ guestName, guestId, hasTicket, hasAttended = false, isOpen, onClose, onToggle }: InvitationLetterProps) {
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget && isOpen) {
            onClose();
        }
    };

    return (
        <div 
            className={cn(
                "fixed inset-0 z-[100] transition-colors duration-700",
                isOpen ? "bg-black/80 backdrop-blur-sm pointer-events-auto" : "bg-transparent pointer-events-none"
            )}
            onClick={handleBackdropClick}
        >
            <style dangerouslySetInnerHTML={{ __html: `
                .letter-background {
                    background: #fdfaf0;
                    border: 1px solid #D4AF37;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.5);
                }
                .letter-content-wrapper {
                    position: relative;
                    height: 100%;
                }
                .letter-content-wrapper::before {
                    content: '';
                    position: absolute;
                    inset: 16px;
                    border: 1px solid rgba(212,175,55,0.4);
                    pointer-events: none;
                }
            `}} />

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    >
                        <div className="w-[90vw] md:w-[612px] max-h-[90vh] min-h-[400px] letter-background pointer-events-auto">
                            <div className="letter-content-wrapper flex flex-col">
                                {/* Scrollable content area */}
                                <div className="flex-1 overflow-y-auto p-6 md:p-12 flex flex-col items-center text-center space-y-4 md:space-y-6">
                                <div className="w-32 h-1 bg-gold opacity-40 mb-2 shrink-0" />
                                <h2 className="font-serif text-3xl md:text-4xl text-stone-800 tracking-[0.2em]">
                                    尊貴的 {guestName}
                                </h2>
                                <div className="font-accent text-xl md:text-2xl text-stone-700 italic opacity-90">
                                    「機會跟命運常常伴隨我們左右，<br/>
                                    但能牢牢抓住的人也就少數幾個」
                                </div>
                                <div className="w-16 h-px bg-stone-300 shrink-0" />
                                <div className="font-serif text-2xl md:text-3xl text-stone-900 font-bold tracking-[0.3em] uppercase whitespace-nowrap">
                                    老奶奶酒會：酒廠大亨
                                </div>
                                <div className="font-accent text-xl text-stone-700 whitespace-nowrap">
                                    在這個金權交織的夜晚，<br/>
                                    您準備好與我們共飲這杯「命運」了嗎？
                                </div>
                                
                                {!hasAttended && (
                                    <div className="mt-4 flex flex-col items-center">
                                        <div className="text-stone-600 font-serif text-xs md:text-sm mb-3 tracking-widest uppercase text-center">
                                            {hasTicket ? (
                                                <span className="text-stone-800 font-bold border-b border-gold/50 pb-1">憑此畫面向特洛斯領取實體票</span>
                                            ) : (
                                                "您的專屬入場碼"
                                            )}
                                        </div>
                                        <div className="p-2 border border-gold/40 bg-white shadow-sm rounded-sm">
                                            <img 
                                                src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${guestId}`}
                                                alt="Guest QR Code"
                                                width={100}
                                                height={100}
                                                className="block"
                                                crossOrigin="anonymous"
                                            />
                                        </div>
                                        <div className="text-[#8b0000] text-[10px] md:text-xs mt-3 font-bold tracking-widest">
                                            ⚠️ 請將螢幕調亮以利掃描
                                        </div>
                                    </div>
                                )}

                                {hasAttended && (
                                    <div className="mt-4 flex flex-col items-center justify-center h-[140px]">
                                        <div className="relative flex items-center justify-center w-28 h-28 rounded-full border-[3px] border-[#8b0000] p-1 rotate-[-15deg] opacity-80" style={{ filter: 'drop-shadow(0 0 2px rgba(139, 0, 0, 0.3))' }}>
                                            <div className="flex items-center justify-center w-full h-full rounded-full border border-[#8b0000]">
                                                <div className="text-[#8b0000] font-serif font-bold text-xl tracking-[0.2em] whitespace-nowrap pl-1">
                                                    已參加
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                
                                <div className="pt-2 flex flex-col items-center w-full mb-2">
                                    <div className="font-accent text-3xl md:text-4xl text-gold-dark rotate-[-3deg]">
                                        Granny Bar
                                    </div>
                                </div>
                            </div>
                            
                            {/* Fixed Footer for the button */}
                            <div className="shrink-0 pt-2 pb-6 md:pb-8 flex justify-center relative z-20">
                                <button 
                                    onClick={onClose}
                                    className="px-8 py-2 md:py-3 border border-stone-800 text-stone-800 font-serif tracking-widest hover:bg-stone-800 hover:text-[#fdfaf0] transition-colors pointer-events-auto bg-[#fdfaf0] text-sm md:text-base"
                                >
                                    收起信件
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
                )}
            </AnimatePresence>

            {/* Collapsed State Toggle (Elegant Envelope Icon) */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.5 }}
                        className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 w-[60px] h-[60px] md:w-[80px] md:h-[80px] z-20 flex flex-col items-center justify-center cursor-pointer pointer-events-auto"
                        onClick={onToggle}
                        style={{ filter: 'drop-shadow(0 0 10px rgba(212,175,55,0.2))' }}
                        whileHover={{ scale: 1.1, filter: 'drop-shadow(0 0 15px rgba(212,175,55,0.5))' }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <svg viewBox="0 0 100 70" className="w-full h-full text-[#D4AF37] overflow-visible">
                            {/* Envelope Back */}
                            <rect x="0" y="0" width="100" height="70" fill="#0a0a0a" stroke="currentColor" strokeWidth="2" />
                            {/* Envelope Flaps */}
                            <path d="M 0 0 L 50 40 L 100 0 L 100 70 L 0 70 Z" fill="#111111" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                            <path d="M 0 0 L 50 40 L 100 0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                            {/* Mini Diamond */}
                            <path d="M 50 34 L 55 39 L 50 44 L 45 39 Z" fill="#0a0a0a" stroke="currentColor" strokeWidth="1" />
                        </svg>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
