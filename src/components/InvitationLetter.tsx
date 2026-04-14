"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";

interface InvitationLetterProps {
    guestName: string;
    isOpen: boolean;
    onClose: () => void;
    onToggle: () => void;
}

type Step = "hidden" | "popping" | "unfolded" | "rolling" | "rolled" | "unroll-in-place" | "move-center";

export default function InvitationLetter({ guestName, isOpen, onClose, onToggle }: InvitationLetterProps) {
    const [step, setStep] = useState<Step>("hidden");
    const [hasExtracted, setHasExtracted] = useState(false);

    useEffect(() => {
        let t1: NodeJS.Timeout;
        let t2: NodeJS.Timeout;

        if (isOpen && !hasExtracted) {
            setStep("popping");
            t1 = setTimeout(() => {
                setStep("unfolded");
                setHasExtracted(true);
            }, 800);
        } else if (!isOpen && hasExtracted) {
            setStep("rolling");
            t1 = setTimeout(() => {
                setStep("rolled");
            }, 1000);
        } else if (isOpen && hasExtracted) {
            setStep("unroll-in-place");
            t1 = setTimeout(() => {
                setStep("move-center");
                t2 = setTimeout(() => {
                    setStep("unfolded");
                }, 800);
            }, 800);
        }

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
        };
    }, [isOpen, hasExtracted]);

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget && step === "unfolded") {
            onClose();
        }
    };

    const getPosition = useMemo(() => {
        const CenterStyles = { left: "50%", x: "-50%", y: 0, scale: 1, opacity: 1 };
        const RightStyles = { left: "100%", x: "calc(-100% - 40px)", y: 0, scale: 1, opacity: 1 };

        return (currentStep: Step) => {
            switch (currentStep) {
                case "hidden": return { ...CenterStyles, y: "-100vh", scale: 0.5, opacity: 0 };
                case "popping": return CenterStyles;
                case "unfolded": return CenterStyles;
                case "rolling": return RightStyles;
                case "rolled": return RightStyles;
                case "unroll-in-place": return RightStyles;
                case "move-center": return CenterStyles;
            }
        };
    }, []);

    const getClip = () => {
        switch (step) {
            case "hidden": return "inset(0% 0% 0% 0%)";
            case "popping": return "inset(0% 0% 0% 0%)";
            case "unfolded": return "inset(0% 0% 0% 0%)";
            case "rolling": return "inset(0% 0% 0% 100%)"; // 完全縮進去
            case "rolled": return "inset(0% 0% 0% 100%)";
            case "unroll-in-place": return "inset(0% 0% 0% 0%)";
            case "move-center": return "inset(0% 0% 0% 0%)";
        }
    };

    // 判斷邀請函內容是否該顯示 (避免與捲軸重疊)
    const isContentVisible = step === "unfolded" || step === "popping" || step === "move-center" || step === "unroll-in-place";
    const isBackgroundActive = isContentVisible;

    return (
        <div 
            className={cn(
                "fixed inset-0 z-[100] transition-colors duration-700",
                isBackgroundActive ? "bg-black/80 backdrop-blur-sm pointer-events-auto" : "bg-transparent pointer-events-none"
            )}
            onClick={handleBackdropClick}
        >
            <motion.div
                initial={getPosition("hidden")}
                animate={getPosition(step)}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="absolute top-1/2 -translate-y-1/2"
            >
                <div className="relative w-[90vw] md:w-[672px] h-[80vh] md:h-auto md:min-h-[600px] pointer-events-none">
                    {/* 1. The Main Parchment Paper */}
                    <motion.div
                        animate={{ clipPath: getClip() }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                        className="w-full h-full bg-[#fdfaf3] shadow-lg rounded-sm overflow-hidden border-y border-stone-300 pointer-events-auto"
                        style={{ 
                            backgroundImage: "url('/paper-texture.png')", 
                            backgroundSize: "cover",
                            pointerEvents: isContentVisible ? "auto" : "none" 
                        }}
                    >
                        {/* 內容區域：增加淡入淡出動畫，防止收合時文字溢出 */}
                        <motion.div 
                            animate={{ opacity: isContentVisible ? 1 : 0 }}
                            transition={{ duration: 0.3 }}
                            className="p-10 md:p-20 flex flex-col items-center text-center space-y-10 min-w-[320px] md:min-w-[672px]"
                        >
                            <div className="w-32 h-1 bg-gold opacity-40 mb-2" />
                            <h2 className="font-serif text-3xl md:text-4xl text-stone-800 tracking-[0.2em]">
                                尊貴的 {guestName}
                            </h2>
                            <div className="font-accent text-xl md:text-2xl text-stone-700 italic opacity-90">
                                「機會跟命運常常伴隨我們左右，<br/>
                                但能牢牢抓住的人也就少數幾個」
                            </div>
                            <div className="w-16 h-px bg-stone-300" />
                            <div className="font-serif text-2xl md:text-3xl text-stone-900 font-bold tracking-[0.3em] uppercase whitespace-nowrap">
                                老奶奶酒會：酒廠大亨
                            </div>
                            <div className="font-accent text-xl text-stone-700 whitespace-nowrap">
                                在這個金權交織的夜晚，<br/>
                                您準備好與我們共飲這杯「命運」了嗎？
                            </div>
                            <div className="pt-10 flex flex-col items-center">
                                <div className="font-accent text-4xl text-gold-dark rotate-[-3deg]">
                                    Granny Bar
                                </div>
                            </div>
                            <div className="w-32 h-1 bg-gold opacity-40 mt-2" />
                        </motion.div>
                        <div className="absolute inset-0 pointer-events-none opacity-25 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />
                    </motion.div>

                    {/* 2. The Rolled Cylinder (Right Cap) */}
                    <motion.div
                        animate={{ opacity: isContentVisible ? 0 : 1 }}
                        transition={{ duration: 0.3 }}
                        className="absolute right-0 top-0 w-[80px] h-[64vh] md:h-[480px] shadow-2xl z-10 flex flex-col items-center justify-center cursor-pointer"
                        style={{ 
                            backgroundImage: "url('/paper-texture.png')", 
                            backgroundSize: "cover",
                            clipPath: "polygon(0% 0%, 100% 0%, 95% 50%, 100% 100%, 0% 100%, 5% 50%)",
                            pointerEvents: isContentVisible ? "none" : "auto" 
                        }}
                        onClick={() => onToggle()}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/30 pointer-events-none border-l-2 border-stone-600/30" />
                        <motion.div 
                            animate={{ opacity: isContentVisible ? 0 : 1 }}
                            className="relative w-[110%] h-12 bg-gradient-to-b from-red-600 to-red-800 border-y border-red-950 flex items-center justify-center shadow-2xl pointer-events-none"
                        >
                            <div className="w-12 h-12 rounded-full bg-[#D4AF37] border-2 border-yellow-700 shadow-md flex items-center justify-center relative">
                                <div className="absolute inset-1 rounded-full border border-black/10" />
                                <span className="font-serif text-[10px] font-bold text-yellow-900 leading-none tracking-widest">GR</span>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}
